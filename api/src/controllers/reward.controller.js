import RewardCampaign from '../models/RewardCampaign.js';
import RewardLedger from '../models/RewardLedger.js';
import User from '../models/User.js';
import Ledger from '../models/Ledger.js';
import AdminLog from '../models/AdminLog.js';
import syncService from '../services/syncService.js';

// @desc    Get user's rewards status, active campaigns, and ledger history
// @route   GET /api/v1/rewards/me
// @access  Private (User)
export const getUserRewards = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const campaigns = await RewardCampaign.find({ status: 'active' });
        const history = await RewardLedger.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            availablePoints: user.rewardPoints || 0,
            lifetimePoints: user.lifetimeRewards || 0,
            giftPoints: user.giftPoints || 0,
            activeCampaigns: campaigns,
            history
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user rewards' });
    }
};

// @desc    Convert reward points into Gift Points
// @route   POST /api/v1/rewards/convert
// @access  Private (User)
export const convertRewards = async (req, res) => {
    try {
        const { amount } = req.body;
        const parsedAmount = Number(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Invalid conversion amount' });
        }

        const user = await User.findById(req.user._id);

        if (user.rewardPoints < parsedAmount) {
            return res.status(400).json({ error: 'Insufficient reward points' });
        }

        // Atomically adjust balances
        user.rewardPoints -= parsedAmount;
        user.giftPoints += parsedAmount;
        await user.save();

        // 1. Create Debit entry in Reward Ledger
        const rewardLedgerEntry = await RewardLedger.create({
            userId: user._id,
            type: 'debit',
            amount: parsedAmount,
            category: 'promo',
            description: `Converted ${parsedAmount} Reward Points into Gift Points`,
            runningBalance: user.rewardPoints,
            status: 'completed'
        });

        // 2. Create Credit entry in Main Wallet Ledger (Gift Points walletType)
        await Ledger.create({
            userId: user._id,
            type: 'credit',
            walletType: 'points',
            amount: parsedAmount,
            category: 'bonus',
            description: `Exchanged Reward Points to Gift Points`,
            runningBalance: user.giftPoints,
            status: 'completed'
        });

        // 3. Dispatch Notification
        await syncService.handleTransactionUpdate(user, {
            _id: rewardLedgerEntry._id,
            type: 'reward-conversion',
            amount: parsedAmount,
            asset: 'POINTS'
        }, 'completed');

        res.status(200).json({
            message: 'Rewards converted successfully',
            availablePoints: user.rewardPoints,
            giftPoints: user.giftPoints
        });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Conversion failed' });
    }
};

// @desc    Get all campaigns (Admin only)
// @route   GET /api/v1/rewards/admin/campaigns
// @access  Private (Admin)
export const getAdminCampaigns = async (req, res) => {
    try {
        const campaigns = await RewardCampaign.find().sort({ createdAt: -1 });
        res.status(200).json({ campaigns });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
};

// @desc    Create a new reward campaign (Admin only)
// @route   POST /api/v1/rewards/admin/campaigns
// @access  Private (Admin)
export const createAdminCampaign = async (req, res) => {
    try {
        const { name, type, rate, startDate, endDate } = req.body;

        if (!name || !type || rate === undefined) {
            return res.status(400).json({ error: 'Missing required campaign fields' });
        }

        const campaign = await RewardCampaign.create({
            name,
            type,
            rate: Number(rate),
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });

        await AdminLog.create({
            adminId: req.user._id,
            action: 'CREATE_REWARD_CAMPAIGN',
            targetId: campaign._id,
            targetType: 'RewardCampaign',
            details: `Created campaign: ${name} (${type}) with rate ${rate}`
        });

        res.status(201).json({ message: 'Campaign created successfully', campaign });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Campaign name already exists' });
        }
        res.status(500).json({ error: 'Failed to create campaign' });
    }
};

// @desc    Update / Suspend a reward campaign (Admin only)
// @route   PATCH /api/v1/rewards/admin/campaigns/:id
// @access  Private (Admin)
export const updateAdminCampaign = async (req, res) => {
    try {
        const { status, rate, endDate } = req.body;
        const campaign = await RewardCampaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        if (status) campaign.status = status;
        if (rate !== undefined) campaign.rate = Number(rate);
        if (endDate !== undefined) campaign.endDate = endDate ? new Date(endDate) : null;

        await campaign.save();

        await AdminLog.create({
            adminId: req.user._id,
            action: 'UPDATE_REWARD_CAMPAIGN',
            targetId: campaign._id,
            targetType: 'RewardCampaign',
            details: `Updated campaign status to ${campaign.status}, rate ${campaign.rate}`
        });

        res.status(200).json({ message: 'Campaign updated successfully', campaign });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update campaign' });
    }
};

// @desc    Credit or Debit user rewards manually (Admin only)
// @route   POST /api/v1/rewards/admin/adjust
// @access  Private (Admin)
export const adjustUserRewards = async (req, res) => {
    try {
        const { userEmail, type, amount, category, description } = req.body;
        const parsedAmount = Number(amount);

        if (!userEmail || !type || isNaN(parsedAmount) || parsedAmount <= 0 || !category) {
            return res.status(400).json({ error: 'Invalid or missing adjustment inputs' });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (type === 'debit' && user.rewardPoints < parsedAmount) {
            return res.status(400).json({ error: 'Insufficient available reward balance to debit' });
        }

        // Adjust available and lifetime points
        if (type === 'credit') {
            user.rewardPoints += parsedAmount;
            user.lifetimeRewards += parsedAmount;
        } else {
            user.rewardPoints -= parsedAmount;
        }

        await user.save();

        // Write ledger entry
        const rewardLedgerEntry = await RewardLedger.create({
            userId: user._id,
            type,
            amount: parsedAmount,
            category,
            description: description || `Manual admin adjustment (${type})`,
            runningBalance: user.rewardPoints,
            status: 'completed'
        });

        // Audit log entry
        await AdminLog.create({
            adminId: req.user._id,
            action: 'MANUAL_REWARD_ADJUSTMENT',
            targetId: user._id,
            targetType: 'User',
            details: `Manually ${type}ed ${parsedAmount} reward points in ${category} category.`
        });

        // Notify user
        await syncService.handleTransactionUpdate(user, {
            _id: rewardLedgerEntry._id,
            type: 'manual-reward',
            amount: parsedAmount,
            asset: 'POINTS'
        }, type === 'credit' ? 'credited' : 'debited');

        res.status(200).json({
            message: `User rewards adjusted successfully`,
            rewardPoints: user.rewardPoints,
            lifetimeRewards: user.lifetimeRewards
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to adjust user rewards' });
    }
};

// @desc    Get Rewards platform analytics (Admin only)
// @route   GET /api/v1/rewards/admin/analytics
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res) => {
    try {
        const stats = await RewardLedger.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalPoints: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const categoryStats = await RewardLedger.aggregate([
            { $match: { type: 'credit' } },
            {
                $group: {
                    _id: '$category',
                    totalPoints: { $sum: '$amount' }
                }
            }
        ]);

        const conversions = await RewardLedger.countDocuments({ description: { $regex: /converted/i } });
        const totalUsersWithRewards = await User.countDocuments({ rewardPoints: { $gt: 0 } });
        const ledgerLogs = await RewardLedger.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            stats,
            categoryStats,
            conversions,
            totalUsersWithRewards,
            ledgerLogs
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rewards analytics' });
    }
};
