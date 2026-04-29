import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    symbol: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    icon: {
        type: String, // SVG path or identifier
        default: ''
    },
    currentRate: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    supportedNetworks: [{
        networkName: {
            type: String,
            required: true,
            trim: true
        },
        walletAddress: {
            type: String,
            required: true,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        }
    }]
}, {
    timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
