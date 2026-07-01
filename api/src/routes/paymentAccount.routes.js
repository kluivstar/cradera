import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
    createPaymentAccount,
    getMyPaymentAccounts,
    updatePaymentAccount,
    deletePaymentAccount
} from '../controllers/paymentAccount.controller.js';

const router = express.Router();

router.post('/', protect, createPaymentAccount);
router.get('/', protect, getMyPaymentAccounts);
router.patch('/:id', protect, updatePaymentAccount);
router.delete('/:id', protect, deletePaymentAccount);

export default router;
