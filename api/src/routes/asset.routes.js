import express from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import {
    getActiveAssets,
    getAssetById,
    getAllAssets,
    createAsset,
    updateAsset,
    deleteAsset
} from '../controllers/asset.controller.js';

const router = express.Router();

// Public/User routes
router.get('/active', protect, getActiveAssets);
router.get('/:id', protect, getAssetById);

// Admin routes
router.get('/', protect, adminOnly, getAllAssets);
router.post('/', protect, adminOnly, createAsset);
router.patch('/:id', protect, adminOnly, updateAsset);
router.delete('/:id', protect, adminOnly, deleteAsset);

export default router;
