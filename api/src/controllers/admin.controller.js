import User from '../models/User.js';

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
