import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import {
    createWithdrawal,
    getMyWithdrawals,
    getAllWithdrawals,
    processWithdrawal,
    payWithdrawal,
    rejectWithdrawal
} from '../controllers/withdrawal.controller.js';

const router = express.Router();

// USER Routes
router.post('/', protect, createWithdrawal);
router.get('/me', protect, getMyWithdrawals);

// ADMIN Routes
router.get('/', protect, adminOnly, getAllWithdrawals);
router.post('/:id/process', protect, adminOnly, processWithdrawal);
router.post('/:id/pay', protect, adminOnly, payWithdrawal);
router.post('/:id/reject', protect, adminOnly, rejectWithdrawal);

export default router;
