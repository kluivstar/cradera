import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { getUserLedger, getAdminUserLedger, adjustUserBalance } from '../controllers/ledger.controller.js';

const router = express.Router();

// User routes
router.get('/me', protect, getUserLedger);

// Admin routes
router.get('/admin/user/:userId', protect, adminOnly, getAdminUserLedger);
router.post('/admin/adjust', protect, adminOnly, adjustUserBalance);

export default router;
