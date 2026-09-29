import { sendTransactionalEmail } from '../emails/emailService.js';

// We mock the queue export so we don't break controllers that try to use `emailQueue.getJobCounts(...)`
export const emailQueue = {
    getJobCounts: async () => ({ completed: 0, failed: 0, waiting: 0, active: 0 })
};

/**
 * Send an email directly (bypassing Redis/BullMQ queue)
 * @param {Object} data - Email details (to, subject, templateName, context)
 */
export const addEmailToQueue = async (data) => {
    try {
        console.log(`Sending email directly (no queue) to: ${data.to}`);
        await sendTransactionalEmail(data.to, data.subject, data.templateName, data.context);
        console.log(`Email sent successfully to: ${data.to}`);
    } catch (error) {
        console.error('Failed to send email:', error.message);
    }
};

export default emailQueue;
