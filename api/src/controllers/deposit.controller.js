import Deposit from '../models/Deposit.js';
import User from '../models/User.js';
import AdminLog from '../models/AdminLog.js';
import syncService from '../services/syncService.js';

// @desc    Create a new deposit
// @route   POST /api/deposits
// @access  Private (User)
export const createDeposit = async (req, res) => {
    try {
        const { assetType, network, amount, txHash, fromAddress, toAddress } = req.body;

        const deposit = await Deposit.create({
            userId: req.user._id,
            assetType,
            network,
            amount,
            txHash,
            fromAddress,
            toAddress
        });

        res.status(201).json({
            message: 'Deposit recorded successfully',
            deposit
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Transaction hash already exists' });
        }
        res.status(500).json({ error: err.message || 'Error recording deposit' });
    }
};

// @desc    Get my deposits
// @route   GET /api/deposits/me
// @access  Private (User)
export const getMyDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ deposits });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching your deposits' });
    }
};

// @desc    Get all deposits
// @route   GET /api/deposits
// @access  Private (Admin)
export const getAllDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find()
            .populate('userId', 'email')
            .populate('verifiedBy', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ deposits });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching all deposits' });
    }
};

// @desc    Confirm a deposit
// @route   POST /api/deposits/:id/confirm
// @access  Private (Admin)
export const confirmDeposit = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ error: 'Deposit already processed' });
        }

        deposit.status = 'confirmed';
        deposit.verifiedBy = req.user._id;
        deposit.verifiedAt = Date.now();
        if (adminNotes) deposit.adminNotes = adminNotes;

        await deposit.save();

        // Update User Balance
        const user = await User.findById(deposit.userId);
        if (user) {
            user.availableBalance += deposit.amount;
            await user.save();
            await syncService.handleTransactionUpdate(user, { ...deposit.toObject(), type: 'deposit' }, 'confirmed');
        }

        // Log action
        await AdminLog.create({
            adminId: req.user._id,
            action: 'VERIFIED_DEPOSIT',
            targetId: deposit._id,
            targetType: 'Deposit',
            details: `Confirmed deposit of ${deposit.amount} ${deposit.assetType}. TX: ${deposit.txHash}`
        });

        res.status(200).json({
            message: 'Deposit confirmed successfully',
            deposit
        });
    } catch (err) {
        res.status(500).json({ error: 'Error confirming deposit' });
    }
};

// @desc    Reject a deposit
// @route   POST /api/deposits/:id/reject
// @access  Private (Admin)
export const rejectDeposit = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ error: 'Deposit already processed' });
        }

        deposit.status = 'rejected';
        deposit.verifiedBy = req.user._id;
        deposit.verifiedAt = Date.now();
        if (adminNotes) deposit.adminNotes = adminNotes;

        await deposit.save();

        // Notify User
        const user = await User.findById(deposit.userId);
        if (user) {
            await syncService.handleTransactionUpdate(user, { ...deposit.toObject(), type: 'deposit' }, 'rejected');
        }

        // Log action
        await AdminLog.create({
            adminId: req.user._id,
            action: 'DECLINED_DEPOSIT',
            targetId: deposit._id,
            targetType: 'Deposit',
            details: `Rejected deposit of ${deposit.amount} ${deposit.assetType}. TX: ${deposit.txHash}`
        });

        res.status(200).json({
            message: 'Deposit rejected successfully',
            deposit
        });
    } catch (err) {
        res.status(500).json({ error: 'Error rejecting deposit' });
    }
};

// @desc    Set deposit to in-progress
// @route   POST /api/deposits/:id/in-progress
// @access  Private (Admin)
export const inProgressDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);

        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ error: 'Deposit already processed' });
        }

        deposit.status = 'in-progress';
        deposit.verifiedBy = req.user._id;
        await deposit.save();

        // Notify User
        const user = await User.findById(deposit.userId);
        if (user) {
            await syncService.handleTransactionUpdate(user, { ...deposit.toObject(), type: 'deposit' }, 'in-progress');
        }

        // Log action
        await AdminLog.create({
            adminId: req.user._id,
            action: 'IN_PROGRESS_DEPOSIT',
            targetId: deposit._id,
            targetType: 'Deposit',
            details: `Set deposit of ${deposit.amount} ${deposit.assetType} to in-progress. TX: ${deposit.txHash}`
        });

        res.status(200).json({
            message: 'Deposit set to in-progress',
            deposit
        });
    } catch (err) {
        res.status(500).json({ error: 'Error processing deposit' });
    }
};
