import express from 'express';
import * as depositController from './deposit.controller.js';
import { protect, adminOnly } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Route definitions will go here
// router.post('/', protect, depositController.handleCreateDeposit);
// router.get('/', protect, depositController.handleGetDeposits);
// router.patch('/:id/status', protect, adminOnly, depositController.handleUpdateStatus);

export default router;
