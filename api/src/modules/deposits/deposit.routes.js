import express from 'express';
import * as depositController from './deposit.controller.js';
import { protect, adminOnly } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, depositController.handleCreateDeposit);
router.get('/me', protect, depositController.handleGetMeDeposits);

export default router;
