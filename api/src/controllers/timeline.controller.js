import mongoose from 'mongoose';
import TransactionTimeline from '../models/TransactionTimeline.js';
import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';
import syncService from '../services/syncService.js';
import Ledger from '../models/Ledger.js';
import AdminLog from '../models/AdminLog.js';

// @desc    Get timeline history for a specific transaction
// @route   GET /api/v1/timeline/:transactionId
// @access  Private (User/Admin)
export const getTransactionTimeline = async (req, res) => {
    try {
        const { transactionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: 'Invalid transaction ID format' });
        }

        // Verify transaction exists and belongs to the user
        let tx = await Deposit.findById(transactionId);
        let type = 'deposit';
        if (!tx) {
            tx = await Withdrawal.findById(transactionId);
            type = 'withdrawal';
        }

        if (!tx) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Access check: must be owner or admin
        const txUserId = tx.userId ? tx.userId.toString() : '';
        const reqUserId = req.user && req.user._id ? req.user._id.toString() : '';

        if (req.user.role !== 'admin' && txUserId !== reqUserId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const events = await TransactionTimeline.find({ transactionId })
            .sort({ createdAt: 1 })
            .populate('performedBy', 'username email');

        res.status(200).json({
            transactionId,
            type,
            currentStatus: tx.timelineStatus,
            amount: tx.amount,
            date: tx.createdAt,
            events
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transaction timeline' });
    }
};

// @desc    Update transaction timeline status (Admin only)
// @route   PATCH /api/v1/timeline/admin/:transactionId
// @access  Private (Admin)
export const updateTransactionTimeline = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status, description, adminAction } = req.body;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: 'Invalid transaction ID format' });
        }

        const validStatuses = ['INITIATED', 'DEPOSIT_DETECTED', 'BLOCKCHAIN_CONFIRMING', 'PROCESSING', 'PAYOUT_SENT', 'COMPLETED', 'FAILED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid or missing timeline status' });
        }

        // Find transaction
        let tx = await Deposit.findById(transactionId);
        let type = 'deposit';
        if (!tx) {
            tx = await Withdrawal.findById(transactionId);
            type = 'withdrawal';
        }

        if (!tx) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const prevStatus = tx.timelineStatus || 'INITIATED';
        tx.timelineStatus = status;

        const user = await User.findById(tx.userId);
        if (!user) {
            return res.status(404).json({ error: 'Associated user not found' });
        }

        // Handle structural status transition side-effects (ledger updates and standard status updates)
        if (status === 'COMPLETED') {
            if (type === 'deposit' && tx.status !== 'confirmed') {
                tx.status = 'confirmed';
                tx.verifiedBy = req.user._id;
                tx.verifiedAt = Date.now();
                user.availableBalance += tx.amount;
                await user.save();
                
                await Ledger.create({
                    userId: user._id,
                    type: 'credit',
                    walletType: 'fiat',
                    amount: tx.amount,
                    category: 'deposit',
                    description: `Confirmed crypto deposit (${tx.assetType}) via timeline progression`,
                    runningBalance: user.availableBalance,
                    status: 'completed'
                });
            } else if (type === 'withdrawal' && tx.status !== 'paid') {
                tx.status = 'paid';
                tx.processedBy = req.user._id;
                tx.processedAt = Date.now();
                user.pendingBalance -= tx.amount;
                await user.save();

                const ledgerEntry = await Ledger.findOne({
                    userId: tx.userId,
                    amount: tx.amount,
                    category: 'withdrawal',
                    status: 'pending'
                }).sort({ createdAt: -1 });
                if (ledgerEntry) {
                    ledgerEntry.status = 'completed';
                    await ledgerEntry.save();
                }
            }
        } else if (status === 'FAILED') {
            if (type === 'deposit' && tx.status !== 'rejected') {
                tx.status = 'rejected';
                tx.verifiedBy = req.user._id;
                tx.verifiedAt = Date.now();
            } else if (type === 'withdrawal' && tx.status !== 'rejected') {
                tx.status = 'rejected';
                tx.processedBy = req.user._id;
                tx.processedAt = Date.now();
                user.pendingBalance -= tx.amount;
                user.availableBalance += tx.amount;
                await user.save();

                const ledgerEntry = await Ledger.findOne({
                    userId: tx.userId,
                    amount: tx.amount,
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
                    amount: tx.amount,
                    category: 'bonus',
                    description: 'Refund for failed withdrawal request via timeline progression',
                    runningBalance: user.availableBalance,
                    status: 'completed'
                });
            }
        } else if (status === 'PROCESSING' && type === 'withdrawal' && tx.status === 'pending') {
            tx.status = 'processing';
            tx.processedBy = req.user._id;
            tx.processedAt = Date.now();
        }

        await tx.save();

        // Create transaction timeline log event
        const defaultDesc = `Transaction status updated from ${prevStatus} to ${status}`;
        const timelineLog = await TransactionTimeline.create({
            transactionId,
            transactionType: type,
            status,
            description: description || defaultDesc,
            performedBy: req.user._id,
            metadata: {
                adminAction,
                prevStatus,
                type
            }
        });

        // Create audit log for administrators
        await AdminLog.create({
            adminId: req.user._id,
            action: 'TRANSACTION_TIMELINE_UPDATE',
            targetId: transactionId,
            targetType: type === 'deposit' ? 'Deposit' : 'Withdrawal',
            details: `Updated timeline to ${status}. Action: ${adminAction || 'none'}. Comment: ${description || 'none'}`
        });

        // Trigger Atomic Notifications (App Alert & Email)
        await syncService.handleTransactionUpdate(user, { 
            _id: tx._id, 
            type, 
            amount: tx.amount, 
            asset: type === 'deposit' ? tx.assetType : 'NGN'
        }, status);

        res.status(200).json({
            message: 'Transaction timeline updated successfully',
            timelineLog,
            currentStatus: tx.timelineStatus
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Failed to update transaction timeline' });
    }
};

// @desc    Get all timeline log entries (Admin only)
// @route   GET /api/v1/timeline/admin/all
// @access  Private (Admin)
export const getAllTimelineLogs = async (req, res) => {
    try {
        const logs = await TransactionTimeline.find()
            .sort({ createdAt: -1 })
            .populate('performedBy', 'username email');
        res.status(200).json({ logs });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch timeline logs' });
    }
};
