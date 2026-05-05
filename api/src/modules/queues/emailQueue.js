import { Queue } from 'bullmq';
import redisConnection from '../../config/redis.js';

// Create a new queue
export const emailQueue = new Queue('email-queue', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});

/**
 * Add an email job to the queue
 * @param {Object} data - Email details (to, subject, templateName, context)
 */
export const addEmailToQueue = async (data) => {
    try {
        // PAUSED: Email system is temporarily disabled to prevent Resend/domain errors.
        console.log(`[PAUSED] Email job skipped for: ${data.to}`);
        return;
        
        // await emailQueue.add('send-email', data);
        // console.log(`Email job added to queue for: ${data.to}`);
    } catch (error) {
        console.error('Failed to add email job to queue:', error.message);
    }
};

export default emailQueue;
