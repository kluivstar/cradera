import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisConnection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null, // Required for BullMQ
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
});

redisConnection.on('connect', () => {
    console.log('Redis Connected');
});

redisConnection.on('error', (err) => {
    console.error('Redis Connection Error:', err.message);
});

export default redisConnection;
