import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { 
    getTransactionTimeline, 
    updateTransactionTimeline, 
    getAllTimelineLogs 
} from '../controllers/timeline.controller.js';

const router = express.Router();

// User + Admin tracking endpoint
router.get('/:transactionId', protect, getTransactionTimeline);

// Admin status update & auditing routes
router.get('/admin/all', protect, adminOnly, getAllTimelineLogs);
router.patch('/admin/:transactionId', protect, adminOnly, updateTransactionTimeline);

export default router;
