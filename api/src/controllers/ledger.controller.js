import Ledger from '../models/Ledger.js';
import User from '../models/User.js';
import AdminLog from '../models/AdminLog.js';

// @desc    Get current user's ledger history
// @route   GET /api/ledger/me
// @access  Private (User)
export const getUserLedger = async (req, res) => {
    try {
        const { walletType, type, category, page = 1, limit = 20 } = req.query;
        const query = { userId: req.user._id };

        if (walletType) query.walletType = walletType;
        if (type) query.type = type;
        if (category) query.category = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [records, total] = await Promise.all([
            Ledger.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Ledger.countDocuments(query)
        ]);

        res.status(200).json({
            records,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve ledger entries' });
    }
};

// @desc    Get a user's ledger (Admin only)
// @route   GET /api/ledger/admin/user/:userId
// @access  Private (Admin)
export const getAdminUserLedger = async (req, res) => {
    try {
        const { userId } = req.params;
        const { walletType } = req.query;
        
        const query = { userId };
        if (walletType) query.walletType = walletType;

        const records = await Ledger.find(query).sort({ createdAt: -1 });
        res.status(200).json({ records });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve user ledger for admin' });
    }
};

// @desc    Adjust user's balance manually (Admin only)
// @route   POST /api/ledger/admin/adjust
// @access  Private (Admin)
export const adjustUserBalance = async (req, res) => {
    try {
        const { userId, walletType, type, amount, description } = req.body;

        if (!userId || !walletType || !type || !amount || !description) {
            return res.status(400).json({ error: 'Missing adjustment parameters' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const changeAmount = parseFloat(amount);
        if (isNaN(changeAmount) || changeAmount <= 0) {
            return res.status(400).json({ error: 'Adjustment amount must be a positive number' });
        }

        let newBalance = 0;

        if (walletType === 'fiat') {
            if (type === 'credit') {
                user.availableBalance += changeAmount;
            } else {
                if (user.availableBalance < changeAmount) {
                    return res.status(400).json({ error: 'Insufficient user fiat balance for deduction' });
                }
                user.availableBalance -= changeAmount;
            }
            newBalance = user.availableBalance;
        } else if (walletType === 'points') {
            if (type === 'credit') {
                user.giftPoints += changeAmount;
            } else {
                if (user.giftPoints < changeAmount) {
                    return res.status(400).json({ error: 'Insufficient user gift points balance for deduction' });
                }
                user.giftPoints -= changeAmount;
            }
            newBalance = user.giftPoints;
        } else {
            return res.status(400).json({ error: 'Invalid wallet type' });
        }

        await user.save();

        const category = walletType === 'points' ? 'reward' : (type === 'credit' ? 'admin_credit' : 'debit');

        // Create ledger record
        const ledgerRecord = await Ledger.create({
            userId,
            type,
            walletType,
            amount: changeAmount,
            category,
            description,
            runningBalance: newBalance,
            status: 'completed'
        });

        // Log admin action
        await AdminLog.create({
            adminId: req.user._id,
            action: 'BALANCE_ADJUSTMENT',
            targetId: userId,
            targetType: 'User',
            details: `Manually adjusted ${walletType} balance by ${type === 'credit' ? '+' : '-'}${changeAmount}. Reason: ${description}`
        });

        res.status(200).json({
            message: 'Balance adjusted successfully',
            user: {
                id: user._id,
                email: user.email,
                availableBalance: user.availableBalance,
                giftPoints: user.giftPoints
            },
            ledgerRecord
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Failed to adjust user balance' });
    }
};
