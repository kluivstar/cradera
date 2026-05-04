import LoginSession from '../../models/LoginSession.js';

/**
 * Track a new login session
 */
export const trackSession = async (userId, req) => {
    try {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        // Deactivate previous current session
        await LoginSession.updateMany({ userId, isCurrent: true }, { isCurrent: false });

        const session = new LoginSession({
            userId,
            ipAddress,
            userAgent,
            // location could be fetched via geoip-lite if needed
            isCurrent: true
        });

        await session.save();
        return session;
    } catch (error) {
        console.error('Session Tracking Error:', error.message);
    }
};

/**
 * Get active sessions for a user
 */
export const getActiveSessions = async (userId) => {
    return await LoginSession.find({ userId }).sort({ lastActive: -1 });
};

/**
 * Revoke a specific session
 */
export const revokeSession = async (sessionId, userId) => {
    return await LoginSession.findOneAndDelete({ _id: sessionId, userId });
};

/**
 * Update session activity
 */
export const updateSessionActivity = async (userId, req) => {
    const userAgent = req.headers['user-agent'];
    await LoginSession.findOneAndUpdate(
        { userId, userAgent, isCurrent: true },
        { lastActive: new Date() }
    );
};
