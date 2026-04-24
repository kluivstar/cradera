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
        unique: true,
        trim: true
    },
    fromAddress: {
        type: String,
        required: true
    },
    toAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String
    },
    verifiedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Deposit = mongoose.model('Deposit', depositSchema);

export default Deposit;
