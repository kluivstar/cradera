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
