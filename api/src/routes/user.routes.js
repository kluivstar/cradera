import express from 'express';
import { getMe } from '../controllers/user.controller.js';
import { getAllUsers } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/', protect, adminOnly, getAllUsers);

export default router;
