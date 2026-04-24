import Joi from 'joi';
import { registerUser, loginUser, generateToken } from '../services/auth.service.js';

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const register = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const user = await registerUser(value);
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        if (err.message === 'User already exists with this email') {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const user = await loginUser({ ...value, roleRequired: 'user' });
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        if (err.message === 'Unauthorized access') {
            return res.status(403).json({ error: 'This portal is for clients only. Please use the Staff Portal.' });
        }
        if (err.message === 'Invalid email or password') {
            return res.status(401).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const user = await loginUser({ ...value, roleRequired: 'admin' });
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: 'Admin login successful',
            user: { id: user._id, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        if (err.message === 'Unauthorized access') {
            return res.status(401).json({ error: 'Access denied. Regular user accounts cannot access the admin portal.' });
        }
        if (err.message === 'Invalid email or password') {
            return res.status(401).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error during admin login' });
    }
};
