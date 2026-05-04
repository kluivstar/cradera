import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as sessionController from '../controllers/session.controller.js';

const router = express.Router();

router.use(protect);

router.get('/', sessionController.getSessions);
router.delete('/:id', sessionController.revokeSession);

export default router;
