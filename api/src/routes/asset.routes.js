import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import {
    getActiveAssets,
    getAllAssets,
    createAsset,
    updateAsset,
    deleteAsset
} from '../controllers/asset.controller.js';

const router = express.Router();

// Public/User routes
router.get('/', protect, getActiveAssets);

// Admin routes
router.get('/admin', protect, adminOnly, getAllAssets);
router.post('/', protect, adminOnly, createAsset);
router.patch('/:id', protect, adminOnly, updateAsset);
router.delete('/:id', protect, adminOnly, deleteAsset);

export default router;
