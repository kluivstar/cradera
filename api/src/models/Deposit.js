import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending'
    },
    transactionHash: String,
    notes: String
}, {
    timestamps: true
});

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;
