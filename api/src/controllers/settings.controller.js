import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Update user profile
// @route   PATCH /api/settings/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { email, fullName, phoneNumber } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            user.email = email;
        }

        if (fullName) user.fullName = fullName;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                kycStatus: user.kycStatus
            }
        });
    } catch (err) {
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
