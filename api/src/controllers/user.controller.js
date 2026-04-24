import User from '../models/User.js';

export const getMe = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching profile' });
    }
};
