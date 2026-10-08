import { Queue } from 'bullmq';
import redisConnection from '../../config/redis.js';

// Create a new queue only if redis is available
export const emailQueue = redisConnection ? new Queue('email-queue', {
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
}) : null;

import { sendTransactionalEmail } from '../emails/emailService.js';

/**
 * Add an email job to the queue
 * @param {Object} data - Email details (to, subject, templateName, context)
 */
export const addEmailToQueue = async (data) => {
    try {
        // Bypassing Redis queue to send email directly
        await sendTransactionalEmail(data.to, data.subject, data.templateName, data.context);
        console.log(`Email sent directly for: ${data.to}`);
    } catch (error) {
        console.error('Failed to add email job to queue:', error.message);
    }
};

export default emailQueue;
