import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    walletType: {
        type: String,
        enum: ['fiat', 'points'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['deposit', 'withdrawal', 'reward', 'bonus', 'referral', 'admin_credit', 'debit', 'purchase', 'fee'],
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
        enum: ['pending', 'processing', 'completed', 'rejected'],
        default: 'completed'
    }
}, {
    timestamps: true
});

const Ledger = mongoose.model('Ledger', ledgerSchema);
export default Ledger;
