import Notification from '../../models/Notification.js';
import User from '../../models/User.js';

/**
 * Create a new notification for a user
 */
export const createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Notification Creation Error:', error.message);
        throw error;
    }
};

/**
 * Broadcast notification to all users
 */
export const broadcastNotification = async (data) => {
    try {
        const users = await User.find({ role: 'user' }).select('_id');
        const notifications = users.map(user => ({
            ...data,
            userId: user._id
        }));
        return await Notification.insertMany(notifications);
    } catch (error) {
        console.error('Broadcast Error:', error.message);
        throw error;
    }
};

/**
 * Get user notifications with pagination
 */
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
    return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
};

/**
 * Get unread count for a user
 */
export const getUnreadCount = async (userId) => {
    return await Notification.countDocuments({ userId, isRead: false });
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId, userId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
    );
};

/**
 * Mark all user notifications as read
 */
export const markAllAsRead = async (userId) => {
    return await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
    );
};
