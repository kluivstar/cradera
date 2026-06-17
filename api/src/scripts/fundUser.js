import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const fund = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.updateOne({ email: 'testuser@cradera.com' }, { $set: { availableBalance: 12500230 } });
        console.log('Funded successfully');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
fund();
