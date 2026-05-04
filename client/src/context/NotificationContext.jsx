import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error('Failed to fetch unread count');
        }
    }, [isAuthenticated]);

    const fetchRecentNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const res = await api.get('/notifications?limit=5');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch recent notifications');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            fetchRecentNotifications();

            // Poll every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, fetchUnreadCount, fetchRecentNotifications]);

    return (
        <NotificationContext.Provider value={{
            unreadCount,
            notifications,
            loading,
            fetchUnreadCount,
            fetchRecentNotifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
