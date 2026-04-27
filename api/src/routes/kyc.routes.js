import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import {
    submitKYC,
    getMyKYC,
    getAllKYC,
    verifyKYC
} from '../controllers/kyc.controller.js';

const router = express.Router();

router.post('/', protect, submitKYC);
router.get('/me', protect, getMyKYC);

// Admin routes
router.get('/admin', protect, adminOnly, getAllKYC);
router.patch('/:id/verify', protect, adminOnly, verifyKYC);

export default router;
