import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';
import PaymentAccount from '../models/PaymentAccount.js';
import syncService from '../services/syncService.js';
import Ledger from '../models/Ledger.js';
import TransactionTimeline from '../models/TransactionTimeline.js';

// @desc    Create a new withdrawal
// @route   POST /api/withdrawals
// @access  Private (User)
export const createWithdrawal = async (req, res) => {
    try {
        const { amount, assetType, payoutMethod, payoutAccountId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Verify user has sufficient balance
        const user = await User.findById(req.user._id);
        if (user.availableBalance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Verify payout account exists and belongs to user
        const payoutAccount = await PaymentAccount.findOne({ _id: payoutAccountId, userId: req.user._id });
        if (!payoutAccount) {
            return res.status(400).json({ error: 'Invalid payout account' });
        }

        // Create withdrawal
        const withdrawal = await Withdrawal.create({
            userId: req.user._id,
            amount,
            assetType: assetType || 'USD',
            payoutMethod,
            payoutAccountId,
            status: 'pending'
        });

        // Update user balances
        user.availableBalance -= amount;
        user.pendingBalance += amount;
        await user.save();

        // Create ledger entry
        await Ledger.create({
            userId: user._id,
            type: 'debit',
            walletType: 'fiat',
            amount,
            category: 'withdrawal',
            description: `Withdrawal request submitted via ${payoutMethod}`,
            runningBalance: user.availableBalance,
            status: 'pending'
        });

        // Create initial timeline event
        await TransactionTimeline.create({
            transactionId: withdrawal._id,
            transactionType: 'withdrawal',
            status: 'INITIATED',
            description: `Withdrawal request of ₦${amount} submitted via ${payoutMethod}.`,
            performedBy: user._id
        });

        res.status(201).json({
            message: 'Withdrawal request submitted successfully',
            withdrawal
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Error creating withdrawal' });
    }
};

// @desc    Get my withdrawals
// @route   GET /api/withdrawals/me
// @access  Private (User)
export const getMyWithdrawals = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [withdrawals, total] = await Promise.all([
            Withdrawal.find({ userId: req.user._id })
                .populate('payoutAccountId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Withdrawal.countDocuments({ userId: req.user._id })
        ]);

        res.status(200).json({
            withdrawals,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching your withdrawals' });
    }
};

// @desc    Get all withdrawals
// @route   GET /api/withdrawals
// @access  Private (Admin)
export const getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find()
            .populate('userId', 'email')
            .populate('payoutAccountId')
            .populate('processedBy', 'email')
            .sort({ createdAt: -1 });
        res.status(200).json({ withdrawals });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching all withdrawals' });
    }
};

// @desc    Process a withdrawal
// @route   POST /api/withdrawals/:id/process
// @access  Private (Admin)
export const processWithdrawal = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ error: 'Withdrawal not found' });
        }

        if (withdrawal.status !== 'pending') {
            return res.status(400).json({ error: 'Withdrawal already processed beyond pending' });
        }

        withdrawal.status = 'processing';
        withdrawal.timelineStatus = 'PROCESSING';
        withdrawal.processedBy = req.user._id;
        withdrawal.processedAt = Date.now();
        if (adminNotes) withdrawal.adminNotes = adminNotes;

        await withdrawal.save();

        // Notify User
        const user = await User.findById(withdrawal.userId);
        if (user) {
            await syncService.handleTransactionUpdate(user, { ...withdrawal.toObject(), type: 'withdrawal' }, 'processing');
        }

        // Create processing timeline event
        await TransactionTimeline.create({
            transactionId: withdrawal._id,
            transactionType: 'withdrawal',
            status: 'PROCESSING',
            description: `Withdrawal request is being processed. Payout dispatch pending.`,
            performedBy: req.user._id
        });

        res.status(200).json({
            message: 'Withdrawal marked as processing',
            withdrawal
        });
    } catch (err) {
        res.status(500).json({ error: 'Error processing withdrawal' });
    }
};

// @desc    Mark withdrawal as paid
// @route   POST /api/withdrawals/:id/pay
// @access  Private (Admin)
export const payWithdrawal = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ error: 'Withdrawal not found' });
        }

        if (withdrawal.status === 'paid' || withdrawal.status === 'rejected') {
            return res.status(400).json({ error: 'Withdrawal already finalized' });
        }

        // Update user pending balance
        const user = await User.findById(withdrawal.userId);
        user.pendingBalance -= withdrawal.amount;
        await user.save();

        withdrawal.status = 'paid';
        withdrawal.timelineStatus = 'COMPLETED';
        withdrawal.processedBy = req.user._id;
        withdrawal.processedAt = Date.now();
        if (adminNotes) withdrawal.adminNotes = adminNotes;

        await withdrawal.save();

        // Update ledger status
        const ledgerEntry = await Ledger.findOne({
            userId: withdrawal.userId,
            amount: withdrawal.amount,
            category: 'withdrawal',
            status: 'pending'
        }).sort({ createdAt: -1 });
        if (ledgerEntry) {
            ledgerEntry.status = 'completed';
            await ledgerEntry.save();
        }

        // Notify User
        // Note: user was already fetched for balance update on line 131
        if (user) {
            await syncService.handleTransactionUpdate(user, { ...withdrawal.toObject(), type: 'withdrawal' }, 'completed');
        }

        // Create completed timeline event
        await TransactionTimeline.create({
            transactionId: withdrawal._id,
            transactionType: 'withdrawal',
            status: 'COMPLETED',
            description: `Withdrawal successfully paid. Funds sent to destination account.`,
            performedBy: req.user._id
        });

        res.status(200).json({
            message: 'Withdrawal marked as paid',
            withdrawal
        });
    } catch (err) {
        res.status(500).json({ error: 'Error marking withdrawal as paid' });
    }
};

// @desc    Reject a withdrawal
// @route   POST /api/withdrawals/:id/reject
// @access  Private (Admin)
export const rejectWithdrawal = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ error: 'Withdrawal not found' });
        }

        if (withdrawal.status === 'paid' || withdrawal.status === 'rejected') {
            return res.status(400).json({ error: 'Withdrawal already finalized' });
        }

        // Revert user balances
        const user = await User.findById(withdrawal.userId);
        user.pendingBalance -= withdrawal.amount;
        user.availableBalance += withdrawal.amount;
        await user.save();

        withdrawal.status = 'rejected';
        withdrawal.timelineStatus = 'FAILED';
        withdrawal.processedBy = req.user._id;
        withdrawal.processedAt = Date.now();
        if (adminNotes) withdrawal.adminNotes = adminNotes;

        await withdrawal.save();

        // Update ledger status and create refund entry
        const ledgerEntry = await Ledger.findOne({
            userId: withdrawal.userId,
            amount: withdrawal.amount,
            category: 'withdrawal',
            status: 'pending'
        }).sort({ createdAt: -1 });
        if (ledgerEntry) {
            ledgerEntry.status = 'rejected';
            await ledgerEntry.save();
        }

        await Ledger.create({
            userId: user._id,
            type: 'credit',
            walletType: 'fiat',
            amount: withdrawal.amount,
            category: 'bonus',
            description: 'Refund for rejected withdrawal request',
            runningBalance: user.availableBalance,
            status: 'completed'
        });

        // Notify User
        // Note: user was already fetched for balance update on line 168
        if (user) {
            await syncService.handleTransactionUpdate(user, { ...withdrawal.toObject(), type: 'withdrawal' }, 'rejected');
        }

        // Create failed timeline event
        await TransactionTimeline.create({
            transactionId: withdrawal._id,
            transactionType: 'withdrawal',
            status: 'FAILED',
            description: `Withdrawal rejected by administrator. Reason: ${adminNotes || 'None provided'}. Funds refunded.`,
            performedBy: req.user._id
        });

        res.status(200).json({
            message: 'Withdrawal rejected and funds reverted',
            withdrawal
        });
    } catch (err) {
        res.status(500).json({ error: 'Error rejecting withdrawal' });
    }
};
