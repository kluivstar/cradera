import User from '../models/User.js';
import ReferralTransaction from '../models/ReferralTransaction.js';

// @desc    Get my referrals
// @route   GET /api/referrals/me
// @access  Private
export const getMyReferrals = async (req, res) => {
    try {
        const referrals = await User.find({ referredBy: req.user._id })
            .select('email createdAt referralCount')
            .sort({ createdAt: -1 });

        res.status(200).json({ referrals });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching referrals' });
    }
};

// @desc    Get referral stats
// @route   GET /api/referrals/stats
// @access  Private
export const getReferralStats = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select('referralCode referralCount');
        
        if (!user.referralCode) {
            user.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await user.save();
        }

        const totalEarned = await ReferralTransaction.aggregate([
            { $match: { referrerId: req.user._id, status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$rewardAmount' } } }
        ]);

        res.status(200).json({
            referralCode: user.referralCode,
            referralCount: user.referralCount || 0,
            totalEarned: totalEarned.length > 0 ? totalEarned[0].total : 0
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching referral stats' });
    }
};
