import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import {
    createDeposit,
    getMyDeposits,
    getAllDeposits,
    confirmDeposit,
    rejectDeposit
} from '../controllers/deposit.controller.js';

const router = express.Router();

// USER Routes
router.post('/', protect, createDeposit);
router.get('/me', protect, getMyDeposits);

// ADMIN Routes
router.get('/', protect, adminOnly, getAllDeposits);
router.post('/:id/confirm', protect, adminOnly, confirmDeposit);
router.post('/:id/reject', protect, adminOnly, rejectDeposit);

export default router;
