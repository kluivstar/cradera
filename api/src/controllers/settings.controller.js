import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Update user profile
// @route   PATCH /api/settings/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { phoneNumber, country, email, password } = req.body;
        
        const user = await User.findById(req.user._id);
        
        // 1. Handle Phone & Country (Locked after KYC)
        if (phoneNumber || country) {
            if (user.kycStatus === 'verified') {
                return res.status(403).json({ error: 'Your identity is verified. Please contact support to change your registered phone or country.' });
            }
            if (phoneNumber) user.phoneNumber = phoneNumber;
            if (country) user.country = country;
        }

        // 2. Handle Email (Password Protected)
        if (email && email !== user.email) {
            if (!password) {
                return res.status(400).json({ error: 'Current password is required to change email' });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password. Email change denied.' });
            }

            // Check if email already taken
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({ error: 'Email is already in use by another account' });
            }

            user.email = email.toLowerCase();
        }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                country: user.country,
                uniqueId: user.uniqueId,
                kycStatus: user.kycStatus
            }
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

// @desc    Update security settings (password)
// @route   PATCH /api/settings/security
// @access  Private
export const updateSecurity = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating security settings' });
    }
};
