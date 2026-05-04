import Joi from 'joi';
import { registerUser, loginUser, generateToken } from '../services/auth.service.js';
import { trackSession } from '../modules/sessions/sessionService.js';
import syncService from '../services/syncService.js';
import { addEmailToQueue } from '../modules/queues/emailQueue.js';

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Passwords do not match' }),
    username: Joi.string().min(3).max(30).required(),
    phoneNumber: Joi.string().required(),
    referralCode: Joi.string().allow('', null),
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

        const { confirmPassword, ...userData } = value;
        const user = await registerUser(userData);
        const token = generateToken(user._id, user.role);

        // Queue welcome email
        await addEmailToQueue({
            to: user.email,
            subject: 'Welcome to Cradera!',
            templateName: 'welcome',
            context: { name: user.username }
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                username: user.username,
                phoneNumber: user.phoneNumber,
                uniqueId: user.uniqueId,
                country: user.country
            },
            token,
        });
    } catch (err) {
        if (err.message === 'User already exists with this email' || err.message === 'Username is already taken') {
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

        // Track session & security alert
        await trackSession(user._id, req);
        await syncService.handleSecurityEvent(user, 'login', req);

        res.status(200).json({
            message: 'Login successful',
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                uniqueId: user.uniqueId,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                country: user.country,
                kycStatus: user.kycStatus
            },
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

        // Track session
        await trackSession(user._id, req);

        res.status(200).json({
            message: 'Admin login successful',
            user: { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                uniqueId: user.uniqueId
            },
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
