import express from 'express';
import { adminLogin } from '../controllers/auth.controller.js';
import { getAllUsers } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', protect, adminOnly, getAllUsers);

export default router;
