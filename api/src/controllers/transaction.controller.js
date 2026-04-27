import Deposit from '../models/Deposit.js';

// @desc    Get user's transactions
// @route   GET /api/transactions
// @access  Private
export const getUserTransactions = async (req, res) => {
    try {
        // Fetch deposits for the current user
        const deposits = await Deposit.find({ userId: req.user.id }).sort({ createdAt: -1 });

        // Map deposits to a standard transaction format
        const transactions = deposits.map(d => ({
            id: d._id,
            type: 'deposit',
            asset: d.assetType,
            amount: d.amount,
            status: d.status,
            date: d.createdAt,
            details: {
                network: d.network,
                hash: d.txHash
            }
        }));

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions/admin
// @access  Private (Admin)
export const getAllTransactions = async (req, res) => {
    try {
        const deposits = await Deposit.find().populate('userId', 'email').sort({ createdAt: -1 });

        const transactions = deposits.map(d => ({
            id: d._id,
            user: d.userId?.email,
            type: 'deposit',
            asset: d.assetType,
            amount: d.amount,
            status: d.status,
            date: d.createdAt,
            details: {
                network: d.network,
                hash: d.txHash
            }
        }));

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch platform transactions' });
    }
};
