import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const fixExistingUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({ 
            $or: [
                { uniqueId: { $exists: false } },
                { username: { $exists: false } },
                { uniqueId: null },
                { username: null },
                { uniqueId: '' },
                { username: '' }
            ]
        });

        console.log(`Found ${users.length} users to update`);

        for (const user of users) {
            let updated = false;
            
            if (!user.uniqueId) {
                user.uniqueId = 'CRD-' + crypto.randomBytes(3).toString('hex').toUpperCase();
                updated = true;
            }
            
            if (!user.username) {
                // Generate a username from email if missing
                const baseName = user.email.split('@')[0].replace(/[^a-zA-Z0-0]/g, '');
                user.username = baseName + crypto.randomBytes(2).toString('hex');
                updated = true;
            }

            if (updated) {
                await user.save();
                console.log(`Updated ${user.email}: ID=${user.uniqueId}, Username=${user.username}`);
            }
        }

        console.log('Done!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixExistingUsers();
