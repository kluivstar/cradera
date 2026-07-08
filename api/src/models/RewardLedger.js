import mongoose from 'mongoose';

const rewardLedgerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RewardCampaign'
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['trading', 'referral', 'promo', 'loyalty'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    runningBalance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'completed'
    }
}, {
    timestamps: true
});

const RewardLedger = mongoose.model('RewardLedger', rewardLedgerSchema);
export default RewardLedger;
