import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import config from './config/env.js';
import connectDB from './config/db.js';

// Route Imports
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

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(morgan('dev')); // Request logging

// CORS Configuration
const allowedOrigins = [
    config.clientUrl?.replace(/\/$/, ""), // Remove trailing slash if present
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || config.env === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root Route
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Cradera API is running', 
        version: '1.0.0',
        docs: '/api/v1/health'
    });
});

// Backward Compatibility: Redirect /api/... to /api/v1/...
app.use((req, res, next) => {
    if (req.url.startsWith('/api/') && !req.url.startsWith('/api/v1/')) {
        const newUrl = req.url.replace('/api/', '/api/v1/');
        console.log(`[CORS/LEGACY] Redirecting ${req.url} to ${newUrl}`);
        req.url = newUrl;
    }
    next();
});

// Health Check Route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

// API Routes (v1)
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/deposits`, depositRoutes);
app.use(`${apiPrefix}/assets`, assetRoutes);
app.use(`${apiPrefix}/kyc`, kycRoutes);
app.use(`${apiPrefix}/transactions`, transactionRoutes);
app.use(`${apiPrefix}/withdrawals`, withdrawalRoutes);
app.use(`${apiPrefix}/payment-accounts`, paymentAccountRoutes);
app.use(`${apiPrefix}/referrals`, referralRoutes);
app.use(`${apiPrefix}/settings`, settingsRoutes);
app.use(`${apiPrefix}/notifications`, notificationRoutes);
app.use(`${apiPrefix}/sessions`, sessionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message,
        error: config.env === 'development' ? err.stack : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Start Server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`[${config.env}] Server is running on port ${PORT}`);
});
