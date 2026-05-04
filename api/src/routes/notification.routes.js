import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', protect, notificationController.getNotifications);
router.get('/unread-count', protect, notificationController.getUnreadCount);
router.patch('/read-all', protect, notificationController.markAllRead);
router.patch('/:id/read', protect, notificationController.markRead);

// Admin Broadcast
router.post('/broadcast', protect, adminOnly, notificationController.broadcast);

export default router;
