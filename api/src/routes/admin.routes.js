import express from 'express';
import { adminLogin } from '../controllers/auth.controller.js';
import { getAllUsers, getDashboardStats, updateUser, deleteUser } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.patch('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
