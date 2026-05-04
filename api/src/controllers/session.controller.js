import * as sessionService from '../modules/sessions/sessionService.js';

export const getSessions = async (req, res) => {
    try {
        const sessions = await sessionService.getActiveSessions(req.user.id);
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const revokeSession = async (req, res) => {
    try {
        await sessionService.revokeSession(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
