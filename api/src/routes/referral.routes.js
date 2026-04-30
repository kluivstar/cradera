import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getMyReferrals, getReferralStats } from '../controllers/referral.controller.js';

const router = express.Router();

router.get('/me', protect, getMyReferrals);
router.get('/stats', protect, getReferralStats);

export default router;
