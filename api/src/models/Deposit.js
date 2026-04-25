import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assetType: {
        type: String,
        required: true
    },
    network: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    txHash: {
        type: String,
        required: true,
        unique: true
    },
    fromAddress: String,
    toAddress: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    adminNotes: String,
    verifiedAt: Date
}, {
    timestamps: true
});

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;
