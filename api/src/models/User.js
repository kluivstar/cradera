import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    uniqueId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    kycStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified'
    },
    availableBalance: {
        type: Number,
        default: 0
    },
    pendingBalance: {
        type: Number,
        default: 0
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true // Allow null for existing users initially
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referralCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
