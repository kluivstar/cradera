import * as notificationService from '../modules/notifications/notificationService.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.id, req.query.page, req.query.limit);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.id);
        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markRead = async (req, res) => {
    try {
        const notification = await notificationService.markAsRead(req.params.id, req.user.id);
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const markAllRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const broadcast = async (req, res) => {
    try {
        const { title, message, type, actionUrl } = req.body;
        await notificationService.broadcastNotification({ title, message, type, actionUrl });
        res.json({ success: true, message: 'Broadcast sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
