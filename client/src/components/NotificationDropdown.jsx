import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown = () => {
    const { unreadCount, notifications, loading, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getTypeColor = (type) => {
        switch (type) {
            case 'SUCCESS': return '#10b981';
            case 'ERROR': return '#ef4444';
            case 'WARNING': return '#f59e0b';
            case 'SECURITY': return '#6366f1';
            default: return '#5170ff';
        }
    };

    const handleNotificationClick = (n) => {
        if (!n.isRead) markAsRead(n._id);
        if (n.actionUrl) {
            setIsOpen(false);
            navigate(n.actionUrl);
        }
    };

    return (
        <div className="notification-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
                className="notification-trigger" 
                style={{ 
                    cursor: 'pointer', 
                    position: 'relative', 
                    padding: '8px', 
                    borderRadius: '12px', 
                    background: '#f8fafc',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: '700',
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        boxShadow: '0 2px 5px rgba(239, 68, 68, 0.3)'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="dropdown-menu notification-menu-mobile fade-in" style={{
                    position: 'absolute',
                    top: '120%',
                    right: '-50%',
                    width: '360px',
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
                    padding: 0,
                    zIndex: 1000,
                    border: '1px solid #f0f0f0',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                style={{ border: 'none', background: 'none', color: '#5170ff', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {loading && notifications.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                                <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                </div>
                                <p style={{ margin: 0, fontWeight: '500', color: '#64748b' }}>No notifications yet</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>We'll alert you when something happens.</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n._id} 
                                    className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderBottom: '1px solid #f8fafc',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        gap: '1rem',
                                        position: 'relative',
                                        background: n.isRead ? 'white' : '#f0f4ff'
                                    }}
                                >
                                    <div style={{ 
                                        width: '10px', 
                                        height: '10px', 
                                        borderRadius: '50%', 
                                        background: getTypeColor(n.type),
                                        marginTop: '4px',
                                        flexShrink: 0
                                    }}></div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: n.isRead ? '500' : '600', color: '#1e293b' }}>{n.title}</p>
                                        <p style={{ margin: '0.2rem 0 0.4rem 0', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>{n.message}</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {!n.isRead && (
                                        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '6px', height: '6px', borderRadius: '50%', background: '#5170ff' }}></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <Link 
                        to="/dashboard/notifications" 
                        onClick={() => setIsOpen(false)}
                        style={{
                            display: 'block',
                            padding: '1rem',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#5170ff',
                            background: '#f8fafc',
                            textDecoration: 'none',
                            borderTop: '1px solid #f1f5f9'
                        }}
                    >
                        View all notifications
                    </Link>
                </div>
            )}

            <style>{`
                .notification-item:hover {
                    background: #f8fafc !important;
                }
                .notification-item.unread:hover {
                    background: #eef2ff !important;
                }
                @media (max-width: 480px) {
                    .dropdown-menu {
                        width: calc(100vw - 32px) !important;
                        right: -10px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default NotificationDropdown;
