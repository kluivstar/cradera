import KYC from '../models/KYC.js';
import User from '../models/User.js';

// @desc    Submit KYC documents
// @route   POST /api/kyc
// @access  Private
export const submitKYC = async (req, res) => {
    try {
        const { fullName, idType, idNumber } = req.body;

        // Check if user already has a pending or approved KYC
        const existingKYC = await KYC.findOne({ user: req.user.id, status: { $in: ['pending', 'approved'] } });
        if (existingKYC) {
            return res.status(400).json({ error: 'KYC already submitted or approved' });
        }

        const kyc = new KYC({
            user: req.user.id,
            fullName,
            idType,
            idNumber
        });

        await kyc.save();

        // Update user status
        await User.findByIdAndUpdate(req.user.id, { kycStatus: 'pending' });

        res.status(201).json(kyc);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit KYC' });
    }
};

// @desc    Get current user's KYC status
// @route   GET /api/kyc/me
// @access  Private
export const getMyKYC = async (req, res) => {
    try {
        const kyc = await KYC.findOne({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(kyc);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch KYC status' });
    }
};

// @desc    Get all KYC requests (Admin)
// @route   GET /api/kyc/admin
// @access  Private (Admin)
export const getAllKYC = async (req, res) => {
    try {
        const kycRequests = await KYC.find().populate('user', 'email').sort({ createdAt: -1 });
        res.status(200).json(kycRequests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch KYC requests' });
    }
};

// @desc    Verify/Reject KYC (Admin)
// @route   PATCH /api/kyc/:id/verify
// @access  Private (Admin)
export const verifyKYC = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        
        const kyc = await KYC.findById(req.params.id);
        if (!kyc) return res.status(404).json({ error: 'KYC record not found' });

        kyc.status = status;
        kyc.rejectionReason = status === 'rejected' ? rejectionReason : undefined;
        kyc.verifiedBy = req.user.id;
        kyc.verifiedAt = new Date();

        await kyc.save();

        // Update user's kycStatus
        const userStatus = status === 'approved' ? 'verified' : 'rejected';
        await User.findByIdAndUpdate(kyc.user, { kycStatus: userStatus });

        res.status(200).json(kyc);
    } catch (err) {
        res.status(500).json({ error: 'Failed to verify KYC' });
    }
};
