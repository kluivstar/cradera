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
        type: String, // Emoji or URL
        default: '💰'
    },
    networks: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        }
    }],
    rate: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
