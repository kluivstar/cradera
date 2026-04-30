import User from '../models/User.js';
import Deposit from '../models/Deposit.js';
import KYC from '../models/KYC.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
        const pendingKYC = await KYC.countDocuments({ status: 'pending' });
        
        // Calculate total volume from confirmed deposits
        const confirmedDeposits = await Deposit.find({ status: 'confirmed' });
        const totalVolume = confirmedDeposits.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        res.status(200).json({
            stats: {
                totalUsers,
                pendingDeposits,
                pendingKYC,
                totalVolume
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
                username: u.username,
                role: u.role,
                kycStatus: u.kycStatus || 'unverified',
                isVerified: u.isVerified || false,
                createdAt: u.createdAt,
            })),
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching users' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
