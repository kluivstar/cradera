import { createNotification } from '../modules/notifications/notificationService.js';
import { addEmailToQueue } from '../modules/queues/emailQueue.js';

/**
 * Synchronized service to handle updates, notifications, and emails atomically.
 */
class SyncService {
    /**
     * Notify user of a transaction update (Deposit/Withdrawal)
     */
    async handleTransactionUpdate(user, transaction, status) {
        const type = transaction.type === 'deposit' ? 'deposit-update' : 'withdrawal-update';
        const title = transaction.type === 'deposit' ? 'Deposit Update' : 'Withdrawal Update';
        const message = transaction.type === 'deposit' 
            ? `Your deposit of ${transaction.amount} ${transaction.asset} is now ${status}.`
            : `Your withdrawal of ₦${transaction.amount} is now ${status}.`;

        // 1. Create Notification
        await createNotification({
            userId: user._id,
            title,
            message,
            type: status === 'confirmed' || status === 'completed' ? 'SUCCESS' : 'INFO',
            actionUrl: '/dashboard/transactions',
            metadata: { transactionId: transaction._id }
        });

        // 2. Queue Email
        await addEmailToQueue({
            to: user.email,
            subject: title,
            templateName: type,
            context: {
                name: user.username,
                amount: transaction.amount,
                asset: transaction.asset || 'NGN',
                status,
                txId: transaction._id
            }
        });
    }

    /**
     * Notify user of KYC status change
     */
    async handleKYCUpdate(user, status, reason = null) {
        // 1. Create Notification
        await createNotification({
            userId: user._id,
            title: 'KYC Verification Update',
            message: `Your KYC verification has been ${status}. ${reason ? `Reason: ${reason}` : ''}`,
            type: status === 'approved' ? 'SUCCESS' : 'ERROR',
            actionUrl: '/dashboard/settings?tab=kyc'
        });

        // 2. Queue Email
        await addEmailToQueue({
            to: user.email,
            subject: 'KYC Verification Update',
            templateName: 'kyc-update',
            context: {
                name: user.username,
                status,
                reason
            }
        });
    }

    /**
     * Notify user of a security event (e.g., login, password change)
     */
    async handleSecurityEvent(user, eventType, req) {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const device = req.headers['user-agent'];

        if (eventType === 'login') {
            // Queue Login Alert Email
            await addEmailToQueue({
                to: user.email,
                subject: 'Security Alert: New Login',
                templateName: 'login-alert',
                context: {
                    name: user.username,
                    ip,
                    device
                }
            });

            // Optional: Security Notification
            await createNotification({
                userId: user._id,
                title: 'New Login Detected',
                message: `A new login was detected from ${ip}. If this wasn't you, please secure your account.`,
                type: 'SECURITY'
            });
        }
    }
}

export default new SyncService();
