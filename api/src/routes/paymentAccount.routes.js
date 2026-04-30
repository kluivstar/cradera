import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
    createPaymentAccount,
    getMyPaymentAccounts,
    updatePaymentAccount
} from '../controllers/paymentAccount.controller.js';

const router = express.Router();

router.post('/', protect, createPaymentAccount);
router.get('/', protect, getMyPaymentAccounts);
router.patch('/:id', protect, updatePaymentAccount);

export default router;
