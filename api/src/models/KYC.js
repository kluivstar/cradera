import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    idType: {
        type: String,
        enum: ['ID Card', 'Passport', 'Drivers License'],
        required: true
    },
    idNumber: {
        type: String,
        required: true,
        trim: true
    },
    idFrontImage: {
        type: String,
        default: 'https://via.placeholder.com/400x250?text=ID+Front+Preview'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: String,
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: Date
}, {
    timestamps: true
});

const KYC = mongoose.model('KYC', kycSchema);

export default KYC;
