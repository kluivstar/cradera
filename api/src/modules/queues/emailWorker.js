import { Worker } from 'bullmq';
import redisConnection from '../../config/redis.js';
import { sendTransactionalEmail } from '../emails/emailService.js';

const emailWorker = redisConnection ? new Worker('email-queue', async (job) => {
    const { to, subject, templateName, context } = job.data;
    
    console.log(`Processing email job for: ${to} (Template: ${templateName})`);
    
    try {
        await sendTransactionalEmail(to, subject, templateName, context);
        console.log(`Email sent successfully to: ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
        throw error; // Rethrow to trigger BullMQ retry
    }
}, {
    connection: redisConnection,
    concurrency: 5 // Process 5 emails at once
}) : null;

if (emailWorker) {
    emailWorker.on('completed', (job) => {
        console.log(`Job ${job.id} (email) completed`);
    });

    emailWorker.on('failed', (job, err) => {
        console.error(`Job ${job.id} (email) failed:`, err.message);
    });
}

export default emailWorker;
