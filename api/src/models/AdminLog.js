import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['VERIFIED_DEPOSIT', 'DECLINED_DEPOSIT', 'IN_PROGRESS_DEPOSIT', 'USER_UPDATED', 'USER_DELETED', 'KYC_APPROVED', 'KYC_REJECTED']
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetType: {
        type: String,
        required: true,
        enum: ['Deposit', 'User', 'KYC']
    },
    details: {
        type: String
    }
}, {
    timestamps: true
});

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
export default AdminLog;
