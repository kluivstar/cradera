import IORedis from 'ioredis';
import config from './env.js';

const redisUrl = config.redisUrl;

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
