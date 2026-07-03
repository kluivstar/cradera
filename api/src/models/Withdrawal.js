import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    assetType: {
        type: String,
        required: true,
        default: 'USD'
    },
    payoutMethod: {
        type: String,
        enum: ['bank', 'crypto'],
        required: true
    },
    payoutAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentAccount',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'rejected'],
        default: 'pending'
    },
    timelineStatus: {
        type: String,
        enum: ['INITIATED', 'DEPOSIT_DETECTED', 'BLOCKCHAIN_CONFIRMING', 'PROCESSING', 'PAYOUT_SENT', 'COMPLETED', 'FAILED'],
        default: 'INITIATED'
    },
    adminNotes: String,
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    processedAt: Date
}, {
    timestamps: true
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
