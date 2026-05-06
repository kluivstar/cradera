import { Resend } from 'resend';
import config from '../../config/env.js';

const resend = new Resend(config.resendApiKey);

const FROM_EMAIL = 'onboarding@resend.dev'; // Use for testing until domain is verified

/**
 * Send a transactional email using Resend
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} templateName - Name of the template to use
 * @param {Object} context - Data for the template
 */
export const sendTransactionalEmail = async (to, subject, templateName, context) => {
    const html = getEmailHtml(templateName, context);
    
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(`Resend Error: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Email Delivery Error:', error.message);
        throw error;
    }
};

/**
 * Generate HTML for email templates
 * @param {string} templateName 
 * @param {Object} context 
 * @returns {string} HTML string
 */
const getEmailHtml = (templateName, context) => {
    // Simple template engine implementation
    // In a production app, use something like React Email or Handlebars
    
    const baseStyle = `
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
    `;

    const footer = `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
            <p>&copy; ${new Date().getFullYear()} Cradera. All rights reserved.</p>
            <p>You received this email because of activity on your Cradera account.</p>
        </div>
    `;

    let content = '';

    switch (templateName) {
        case 'welcome':
            content = `
                <h1 style="color: #5170ff;">Welcome to Cradera, ${context.name}!</h1>
                <p>We're excited to have you on board. Cradera is the fastest way to sell your crypto and get paid in Naira instantly.</p>
                <p>Start your journey today by completing your KYC and adding a payout method.</p>
                <a href="${config.frontendUrl}/dashboard" style="display: inline-block; padding: 12px 24px; background: #5170ff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Go to Dashboard</a>
            `;
            break;
        
        case 'login-alert':
            content = `
                <h2 style="color: #ff4d4f;">New Login Detected</h2>
                <p>Hello ${context.name}, a new login was detected on your account.</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>IP Address:</strong> ${context.ip}</p>
                    <p><strong>Device:</strong> ${context.device}</p>
                </div>
                <p>If this was not you, please secure your account immediately by resetting your password.</p>
            `;
            break;

        case 'deposit-update':
            content = `
                <h2 style="color: ${context.status === 'confirmed' ? '#10b981' : '#5170ff'};">Deposit Update</h2>
                <p>Your deposit of <strong>${context.amount} ${context.asset}</strong> has been ${context.status}.</p>
                ${context.status === 'confirmed' ? '<p>Your balance has been updated successfully.</p>' : '<p>We are currently processing your request.</p>'}
                <p>Transaction ID: ${context.txId}</p>
            `;
            break;

        case 'withdrawal-update':
            content = `
                <h2 style="color: ${context.status === 'completed' ? '#10b981' : '#5170ff'};">Withdrawal Update</h2>
                <p>Your withdrawal request for <strong>₦${context.amount}</strong> has been ${context.status}.</p>
                ${context.status === 'completed' ? '<p>The funds should reflect in your payout account shortly.</p>' : ''}
            `;
            break;

        case 'kyc-update':
            content = `
                <h2 style="color: ${context.status === 'approved' ? '#10b981' : '#ef4444'};">KYC Verification Update</h2>
                <p>Your KYC verification has been <strong>${context.status}</strong>.</p>
                ${context.status === 'approved' 
                    ? '<p>Congratulations! Your account is now fully verified. You can now perform higher volume transactions.</p>' 
                    : `<p>Unfortunately, your verification was rejected. Reason: <strong>${context.reason || 'Information mismatch'}</strong>. Please re-submit with correct details.</p>`}
            `;
            break;

        default:
            content = `<p>This is an automated notification from Cradera.</p>`;
    }

    return `
        <div style="${baseStyle}">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="${config.logoUrl}" alt="Cradera" style="height: 40px;">
            </div>
            ${content}
            ${footer}
        </div>
    `;
};
