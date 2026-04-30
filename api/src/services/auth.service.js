import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async ({ email, password, referralCode: referrerCode }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique referral code for the new user
    const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Generate unique user ID
    const uniqueId = 'CRD-' + Math.floor(100000 + Math.random() * 900000);

    // Check if referred by someone
    let referredBy = null;
    if (referrerCode) {
        const referrer = await User.findOne({ referralCode: referrerCode.toUpperCase() });
        if (referrer) {
            referredBy = referrer._id;
            // Increment referrer's count
            referrer.referralCount += 1;
            await referrer.save();
        }
    }

    // Create user
    const user = new User({
        email,
        password: hashedPassword,
        role: 'user',
        referralCode: userReferralCode,
        referredBy,
        uniqueId
    });

    await user.save();

    return user;
};

export const loginUser = async ({ email, password, roleRequired = 'user' }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (user.role !== roleRequired) {
        throw new Error('Unauthorized access');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    return user;
};

export const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET || 'secret';
    const expiresIn = process.env.JWT_EXPIRATION || '7d';
    return jwt.sign({ userId, role }, secret, { expiresIn });
};
