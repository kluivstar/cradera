import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import { getUserTransactions, getAllTransactions } from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/', protect, getUserTransactions);
router.get('/admin', protect, adminOnly, getAllTransactions);

export default router;
