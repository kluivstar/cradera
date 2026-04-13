import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async ({ email, password }) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
        email,
        password: hashedPassword,
        role: 'user'
    });

    await user.save();

    return user;
};

export const loginUser = async ({ email, password, roleRequired = 'user' }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (roleRequired === 'admin' && user.role !== 'admin') {
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
