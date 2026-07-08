import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import {
    getUserRewards,
    convertRewards,
    getAdminCampaigns,
    createAdminCampaign,
    updateAdminCampaign,
    adjustUserRewards,
    getAdminAnalytics
} from '../controllers/reward.controller.js';

const router = express.Router();

// User reward actions
router.get('/me', protect, getUserRewards);
router.post('/convert', protect, convertRewards);

// Admin campaign management & audit controls
router.get('/admin/campaigns', protect, adminOnly, getAdminCampaigns);
router.post('/admin/campaigns', protect, adminOnly, createAdminCampaign);
router.patch('/admin/campaigns/:id', protect, adminOnly, updateAdminCampaign);
router.post('/admin/adjust', protect, adminOnly, adjustUserRewards);
router.get('/admin/analytics', protect, adminOnly, getAdminAnalytics);

export default router;
