import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread
    const { markAsRead, markAllAsRead, fetchUnreadCount } = useNotifications();

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/notifications?limit=50${filter === 'unread' ? '&isRead=false' : ''}`);
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAll = async () => {
        await markAllAsRead();
        fetchNotifications();
    };

    const handleRead = async (id) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'SUCCESS': return '#10b981';
            case 'ERROR': return '#ef4444';
            case 'WARNING': return '#f59e0b';
            case 'SECURITY': return '#6366f1';
            default: return '#5170ff';
        }
    };

    return (
        <DashboardLayout title="Notifications">
            <div className="dashboard-content fade-in">
                <div className="dashboard-header-responsive" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '2rem' }}>Notifications</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Stay updated with your account activity.</p>
                    </div>
                    <button 
                        onClick={handleMarkAll}
                        style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="dash-card" style={{ padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem' }}>
                        <button 
                            onClick={() => setFilter('all')}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                padding: '0.5rem 0', 
                                fontSize: '0.9rem', 
                                fontWeight: '600', 
                                color: filter === 'all' ? '#5170ff' : '#94a3b8',
                                borderBottom: filter === 'all' ? '2px solid #5170ff' : '2px solid transparent',
                                cursor: 'pointer'
                            }}
                        >
                            All Notifications
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                padding: '0.5rem 0', 
                                fontSize: '0.9rem', 
                                fontWeight: '600', 
                                color: filter === 'unread' ? '#5170ff' : '#94a3b8',
                                borderBottom: filter === 'unread' ? '2px solid #5170ff' : '2px solid transparent',
                                cursor: 'pointer'
                            }}
                        >
                            Unread
                        </button>
                    </div>

                    <div className="notifications-list">
                        {loading ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                <div style={{ color: '#e2e8f0', marginBottom: '1.5rem' }}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                </div>
                                <h3 style={{ color: '#64748b', fontWeight: '600', marginBottom: '0.5rem' }}>No notifications found</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>When you receive alerts, they will appear here.</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n._id}
                                    style={{
                                        padding: '1.5rem',
                                        borderBottom: '1px solid #f8fafc',
                                        display: 'flex',
                                        gap: '1.5rem',
                                        background: n.isRead ? 'white' : '#f0f4ff',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '12px', 
                                        background: `${getTypeColor(n.type)}15`,
                                        color: getTypeColor(n.type),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{n.title}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b', lineHeight: '1.5', maxWidth: '800px' }}>{n.message}</p>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                            {n.actionUrl && (
                                                <a href={n.actionUrl} style={{ fontSize: '0.85rem', fontWeight: '600', color: '#5170ff', textDecoration: 'none' }}>View Details</a>
                                            )}
                                            {!n.isRead && (
                                                <button onClick={() => handleRead(n._id)} style={{ border: 'none', background: 'none', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', cursor: 'pointer' }}>Mark as read</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NotificationsPage;
