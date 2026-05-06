/**
 * Central API Configuration
 * Uses Vite's import.meta.env for environment-specific variables
 */

// Use VITE_ prefix for Vite environment variables
// Falls back to localhost for development if not provided
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export const API_ENDPOINTS = {
    auth: `${API_BASE_URL}/auth`,
    admin: `${API_BASE_URL}/admin`,
    users: `${API_BASE_URL}/users`,
    deposits: `${API_BASE_URL}/deposits`,
    assets: `${API_BASE_URL}/assets`,
    kyc: `${API_BASE_URL}/kyc`,
    transactions: `${API_BASE_URL}/transactions`,
    withdrawals: `${API_BASE_URL}/withdrawals`,
    paymentAccounts: `${API_BASE_URL}/payment-accounts`,
    referrals: `${API_BASE_URL}/referrals`,
    settings: `${API_BASE_URL}/settings`,
    notifications: `${API_BASE_URL}/notifications`,
    sessions: `${API_BASE_URL}/sessions`,
    health: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
