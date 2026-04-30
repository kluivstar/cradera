import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { updateProfile, updateSecurity } from '../controllers/settings.controller.js';

const router = express.Router();

router.patch('/profile', protect, updateProfile);
router.patch('/security', protect, updateSecurity);

export default router;
