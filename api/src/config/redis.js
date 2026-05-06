import IORedis from 'ioredis';
import config from './env.js';

let redisConnection = null;

if (config.redisUrl && (config.env === 'development' || !config.redisUrl.includes('127.0.0.1'))) {
    try {
        redisConnection = new IORedis(config.redisUrl, {
            maxRetriesPerRequest: null, // Required for BullMQ
            tls: config.redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                if (times > 5) {
                    console.warn(`[REDIS] Connection attempt ${times} failed. Background tasks may be unavailable.`);
                    return null; // Stop retrying after 5 attempts in production if it's failing
                }
                return delay;
            }
        });

        redisConnection.on('connect', () => {
            console.log('Redis Connected');
        });

        redisConnection.on('error', (err) => {
            console.warn('Redis Connection Warning:', err.message);
        });
    } catch (err) {
        console.error('Redis Initialization Error:', err.message);
    }
} else {
    console.log('[REDIS] Redis URL not provided or invalid for production. Background tasks disabled.');
}

export default redisConnection;
