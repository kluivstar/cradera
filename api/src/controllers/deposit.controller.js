import Deposit from '../models/Deposit.js';
import User from '../models/User.js';
import AdminLog from '../models/AdminLog.js';
import syncService from '../services/syncService.js';
import Ledger from '../models/Ledger.js';
import TransactionTimeline from '../models/TransactionTimeline.js';

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

        // Create initial timeline event
        await TransactionTimeline.create({
            transactionId: deposit._id,
            transactionType: 'deposit',
            status: 'INITIATED',
            description: `Deposit claim initiated for ${amount} ${assetType} on ${network} network.`,
            performedBy: req.user._id
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
        deposit.timelineStatus = 'COMPLETED';
        deposit.verifiedBy = req.user._id;
        deposit.verifiedAt = Date.now();
        if (adminNotes) deposit.adminNotes = adminNotes;

        await deposit.save();

        // Update User Balance
        const user = await User.findById(deposit.userId);
        if (user) {
            user.availableBalance += deposit.amount;
            await user.save();

            // Create ledger entry
            await Ledger.create({
                userId: user._id,
                type: 'credit',
                walletType: 'fiat',
                amount: deposit.amount,
                category: 'deposit',
                description: `Confirmed crypto deposit (${deposit.assetType}) via ${deposit.network}`,
                runningBalance: user.availableBalance,
                status: 'completed'
            });

            await syncService.handleTransactionUpdate(user, { ...deposit.toObject(), type: 'deposit' }, 'confirmed');
        }

        // Create timeline completed event
        await TransactionTimeline.create({
            transactionId: deposit._id,
            transactionType: 'deposit',
            status: 'COMPLETED',
            description: 'Deposit confirmed by administrator. Balance credited.',
            performedBy: req.user._id
        });

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
        deposit.timelineStatus = 'FAILED';
        deposit.verifiedBy = req.user._id;
        deposit.verifiedAt = Date.now();
        if (adminNotes) deposit.adminNotes = adminNotes;

        await deposit.save();

        // Notify User
        const user = await User.findById(deposit.userId);
        if (user) {
            await syncService.handleTransactionUpdate(user, { ...deposit.toObject(), type: 'deposit' }, 'rejected');
        }

        // Create timeline failed event
        await TransactionTimeline.create({
            transactionId: deposit._id,
            transactionType: 'deposit',
            status: 'FAILED',
            description: `Deposit rejected by administrator. Reason: ${adminNotes || 'None provided'}`,
            performedBy: req.user._id
        });

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
