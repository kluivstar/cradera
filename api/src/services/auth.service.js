import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

export const registerUser = async ({ email, password, referralCode, username, phoneNumber }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ 
        $or: [
            { email },
            { username }
        ]
    });
    
    if (existingUser) {
        if (existingUser.email === email) throw new Error('User already exists with this email');
        if (existingUser.username === username) throw new Error('Username is already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate my own referral code
    const myReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Generate unique user ID
    const uniqueId = 'CRD-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // Handle being referred
    let referrer = null;
    if (referralCode) {
        referrer = await User.findOne({ referralCode });
        if (referrer) {
            referrer.referralCount += 1;
            await referrer.save();
        }
    }

    const user = new User({
        email,
        password: hashedPassword,
        username,
        phoneNumber,
        referralCode: myReferralCode,
        uniqueId,
        referredBy: referrer ? referrer._id : null
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
