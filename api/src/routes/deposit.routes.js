import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import Deposit from '../models/Deposit.js';

const router = express.Router();

// Get all deposits (Admin only)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        const deposits = await Deposit.find().populate('user', 'email').sort({ createdAt: -1 });
        res.status(200).json({ deposits });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching deposits' });
    }
});

// Update deposit status (Admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const deposit = await Deposit.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ deposit });
    } catch (err) {
        res.status(500).json({ error: 'Error updating deposit' });
    }
});

export default router;
