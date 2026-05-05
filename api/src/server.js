import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import depositRoutes from './routes/deposit.routes.js';
import assetRoutes from './routes/asset.routes.js';
import kycRoutes from './routes/kyc.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import withdrawalRoutes from './routes/withdrawal.routes.js';
import paymentAccountRoutes from './routes/paymentAccount.routes.js';
import referralRoutes from './routes/referral.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import sessionRoutes from './routes/session.routes.js';
// import './modules/queues/emailWorker.js'; // PAUSED: Stop BullMQ worker to prevent timeouts/errors

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/payment-accounts', paymentAccountRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/sessions', sessionRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
