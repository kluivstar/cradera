import mongoose from 'mongoose';

const paymentAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        // Optional for crypto, required for bank
    },
    accountNumber: {
        type: String,
        // Optional for crypto, required for bank
    },
    cryptoWalletAddress: {
        type: String,
    },
    network: {
        type: String,
    },
    type: {
        type: String,
        enum: ['bank', 'crypto'],
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const PaymentAccount = mongoose.model('PaymentAccount', paymentAccountSchema);
export default PaymentAccount;
