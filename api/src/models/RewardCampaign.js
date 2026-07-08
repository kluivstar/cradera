import mongoose from 'mongoose';

const rewardCampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['trading', 'referral', 'promo', 'loyalty'],
        required: true
    },
    rate: {
        type: Number,
        required: true,
        default: 1.0 // 1 point per ₦1000 trade, or flat multiplier
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    }
}, {
    timestamps: true
});

const RewardCampaign = mongoose.model('RewardCampaign', rewardCampaignSchema);
export default RewardCampaign;
