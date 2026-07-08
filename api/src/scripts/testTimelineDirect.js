import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import TransactionTimeline from '../models/TransactionTimeline.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const test = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        console.log('Fetching a deposit...');
        const dep = await Deposit.findOne();
        console.log('Deposit found:', dep ? dep._id : 'None');

        console.log('Fetching a withdrawal...');
        const wd = await Withdrawal.findOne();
        console.log('Withdrawal found:', wd ? wd._id : 'None');

        if (dep) {
            console.log('Querying timeline logs for deposit:', dep._id);
            const logs = await TransactionTimeline.find({ transactionId: dep._id });
            console.log('Timeline logs found:', logs.length);
        }

        process.exit(0);
    } catch (err) {
        console.error('Test error:', err);
        process.exit(1);
    }
};

test();
