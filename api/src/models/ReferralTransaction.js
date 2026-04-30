import mongoose from 'mongoose';

const referralTransactionSchema = new mongoose.Schema({
    referrerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referredUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rewardAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const ReferralTransaction = mongoose.model('ReferralTransaction', referralTransactionSchema);
export default ReferralTransaction;
