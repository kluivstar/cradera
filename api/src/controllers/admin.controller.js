import User from '../models/User.js';
import Deposit from '../models/Deposit.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
        const pendingKYC = await User.countDocuments({ kycStatus: 'pending' });

        res.status(200).json({
            stats: {
                totalUsers,
                pendingDeposits,
                pendingKYC
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching stats' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users: users.map((u) => ({
                id: u._id,
                email: u.email,
                role: u.role,
                createdAt: u.createdAt,
            })),
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching users' });
    }
};
