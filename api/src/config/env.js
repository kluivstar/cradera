import dotenv from 'dotenv';
dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    resendApiKey: process.env.RESEND_API_KEY,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    logoUrl: process.env.LOGO_URL || 'https://cradera.com/logo.png',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Basic validation
const requiredEnvs = ['MONGO_URI'];
if (config.env === 'production') {
    requiredEnvs.push('JWT_SECRET', 'RESEND_API_KEY');
}

requiredEnvs.forEach((key) => {
    if (!process.env[key] && !process.env['MONGODB_URI']) {
        console.warn(`[WARNING]: Missing environment variable: ${key}`);
    }
});

export default config;
