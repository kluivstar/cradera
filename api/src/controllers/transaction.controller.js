import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import ReferralTransaction from '../models/ReferralTransaction.js';

// @desc    Get user's transactions with filtering
// @route   GET /api/transactions
// @access  Private
export const getUserTransactions = async (req, res) => {
    try {
        const { status, asset, startDate, endDate } = req.query;
        const userId = req.user.id;

        // Build query objects
        const query = { userId };
        const refQuery = { referrerId: userId };

        if (status) {
            query.status = status;
            refQuery.status = status === 'paid' ? 'paid' : (status === 'pending' ? 'pending' : 'none');
        }

        if (asset) {
            query.assetType = asset;
            // Referral transactions are currently just 'USD' or generic reward, we'll filter them out if specific crypto is asked
            if (asset !== 'USD') refQuery._id = null; 
        }

        if (startDate || endDate) {
            query.createdAt = {};
            refQuery.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
                refQuery.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
                refQuery.createdAt.$lte = end;
            }
        }

        // Fetch all types
        const [deposits, withdrawals, referrals] = await Promise.all([
            Deposit.find(query).sort({ createdAt: -1 }),
            Withdrawal.find(query).sort({ createdAt: -1 }),
            ReferralTransaction.find(refQuery).populate('referredUserId', 'username').sort({ createdAt: -1 })
        ]);

        // Standardize output
        const allTransactions = [
            ...deposits.map(d => ({
                id: d._id,
                type: 'deposit',
                asset: d.assetType,
                amount: d.amount,
                status: d.status,
                date: d.createdAt,
                details: `Deposit via ${d.network}`
            })),
            ...withdrawals.map(w => ({
                id: w._id,
                type: 'withdrawal',
                asset: w.assetType,
                amount: w.amount,
                status: w.status,
                date: w.createdAt,
                details: `Withdrawal via ${w.payoutMethod}`
            })),
            ...referrals.map(r => ({
                id: r._id,
                type: 'referral_reward',
                asset: 'USD',
                amount: r.rewardAmount,
                status: r.status,
                date: r.createdAt,
                details: `Referral reward (@${r.referredUserId?.username})`
            }))
        ];

        // Final sort by date
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(allTransactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions/admin
// @access  Private (Admin)
export const getAllTransactions = async (req, res) => {
    try {
        const [deposits, withdrawals] = await Promise.all([
            Deposit.find().populate('userId', 'email').sort({ createdAt: -1 }),
            Withdrawal.find().populate('userId', 'email').sort({ createdAt: -1 })
        ]);

        const transactions = [
            ...deposits.map(d => ({
                id: d._id,
                user: d.userId?.email,
                type: 'deposit',
                asset: d.assetType,
                amount: d.amount,
                status: d.status,
                date: d.createdAt,
                details: d.network
            })),
            ...withdrawals.map(w => ({
                id: w._id,
                user: w.userId?.email,
                type: 'withdrawal',
                asset: w.assetType,
                amount: w.amount,
                status: w.status,
                date: w.createdAt,
                details: w.payoutMethod
            }))
        ];

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch platform transactions' });
    }
};
