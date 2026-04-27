import Asset from '../models/Asset.js';

// @desc    Get all active assets for users
// @route   GET /api/assets
// @access  Public
export const getActiveAssets = async (req, res) => {
    try {
        const assets = await Asset.find({ isActive: true });
        res.status(200).json(assets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
};

// @desc    Get all assets for admin
// @route   GET /api/assets/admin
// @access  Private (Admin)
export const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find();
        res.status(200).json(assets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
};

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Private (Admin)
export const createAsset = async (req, res) => {
    try {
        const { name, symbol, icon, networks } = req.body;
        
        const existingAsset = await Asset.findOne({ symbol: symbol.toUpperCase() });
        if (existingAsset) {
            return res.status(400).json({ error: 'Asset with this symbol already exists' });
        }

        const asset = new Asset({
            name,
            symbol,
            icon,
            networks
        });

        await asset.save();
        res.status(201).json(asset);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create asset' });
    }
};

// @desc    Update an asset
// @route   PATCH /api/assets/:id
// @access  Private (Admin)
export const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json(asset);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update asset' });
    }
};

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
// @access  Private (Admin)
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }
        res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete asset' });
    }
};
