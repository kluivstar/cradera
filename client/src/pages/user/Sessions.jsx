import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const SessionsPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/sessions');
            setSessions(res.data);
        } catch (err) {
            console.error('Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id) => {
        if (!window.confirm('Are you sure you want to log out from this device?')) return;
        try {
            await api.delete(`/sessions/${id}`);
            setSessions(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            console.error('Failed to revoke session');
        }
    };

    const getDeviceIcon = (userAgent) => {
        if (/mobile/i.test(userAgent)) return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        );
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        );
    };

    const parseOS = (userAgent) => {
        if (/windows/i.test(userAgent)) return 'Windows';
        if (/mac/i.test(userAgent)) return 'macOS';
        if (/linux/i.test(userAgent)) return 'Linux';
        if (/android/i.test(userAgent)) return 'Android';
        if (/iphone|ipad/i.test(userAgent)) return 'iOS';
        return 'Unknown OS';
    };

    return (
        <DashboardLayout title="Security & Sessions">
            <div className="dashboard-content fade-in">
                <div className="dashboard-header-responsive" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '2rem' }}>Security & Sessions</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Manage your active login sessions and secure your account.</p>
                </div>

                <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
                    <div className="dash-card" style={{ padding: '2rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '12px', background: '#f0f4ff', color: '#5170ff' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Active Sessions</h3>
                        </div>
                        
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>
                            These are the devices currently logged into your account. You can revoke any session if you don't recognize it.
                        </p>

                        <div className="sessions-list">
                            {loading ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading sessions...</p>
                            ) : (
                                sessions.map(session => (
                                    <div 
                                        key={session._id}
                                        style={{
                                            padding: '1.25rem',
                                            borderRadius: '12px',
                                            border: '1px solid #f1f5f9',
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: session.isCurrent ? '#f8fafc' : 'white'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ color: session.isCurrent ? '#5170ff' : '#94a3b8' }}>
                                                {getDeviceIcon(session.userAgent)}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>{parseOS(session.userAgent)}</span>
                                                    {session.isCurrent && (
                                                        <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#10b981', color: 'white', textTransform: 'uppercase' }}>Current</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                                                    {session.ipAddress} • Last active {new Date(session.lastActive).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        {!session.isCurrent && (
                                            <button 
                                                onClick={() => handleRevoke(session._id)}
                                                style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', padding: '0.5rem' }}
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="dash-card" style={{ padding: '2rem', border: 'none', background: '#1e293b', color: 'white' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Security Recommendation</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
                            To keep your Cradera account safe, we recommend regularly reviewing your active sessions and enabling Two-Factor Authentication (2FA).
                        </p>
                        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Unknown Activity?</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>
                                If you see a session you don't recognize, revoke it immediately and change your password.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SessionsPage;
