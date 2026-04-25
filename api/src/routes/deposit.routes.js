import express from 'express';
import { createDeposit, getMyDeposits, getAllDeposits, confirmDeposit, rejectDeposit } from '../controllers/deposit.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createDeposit);
router.get('/me', protect, getMyDeposits);

// Admin routes
router.get('/', protect, adminOnly, getAllDeposits);
router.post('/:id/confirm', protect, adminOnly, confirmDeposit);
router.post('/:id/reject', protect, adminOnly, rejectDeposit);

export default router;
