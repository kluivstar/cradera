import mongoose from 'mongoose';

const transactionTimelineSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: true
    },
    status: {
        type: String,
        enum: ['INITIATED', 'DEPOSIT_DETECTED', 'BLOCKCHAIN_CONFIRMING', 'PROCESSING', 'PAYOUT_SENT', 'COMPLETED', 'FAILED'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const TransactionTimeline = mongoose.model('TransactionTimeline', transactionTimelineSchema);
export default TransactionTimeline;
