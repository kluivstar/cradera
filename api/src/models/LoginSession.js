import mongoose from 'mongoose';

const loginSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: 'Unknown'
    },
    isCurrent: {
        type: Boolean,
        default: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const LoginSession = mongoose.model('LoginSession', loginSessionSchema);

export default LoginSession;
