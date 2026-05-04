import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const AdminBroadcast = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('INFO');
    const [actionUrl, setActionUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to broadcast this message to ALL users?')) return;

        setLoading(true);
        setStatus(null);
        try {
            await api.post('/notifications/broadcast', { title, message, type, actionUrl });
            setStatus({ type: 'success', text: 'Broadcast sent successfully to all users!' });
            setTitle('');
            setMessage('');
            setActionUrl('');
            setType('INFO');
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.error || 'Failed to send broadcast' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Global Broadcast">
            <div className="dashboard-content fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Global Broadcast Tool</h1>
                    <p className="dashboard-subtitle">Send instant notifications and alerts to every active user on the platform.</p>
                </div>

                {status && (
                    <div style={{ 
                        padding: '1rem 1.5rem', 
                        borderRadius: '12px', 
                        marginBottom: '2rem', 
                        background: status.type === 'success' ? '#ecfdf5' : '#fef2f2', 
                        color: status.type === 'success' ? '#059669' : '#dc2626',
                        border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}30`,
                        fontWeight: '500',
                        fontSize: '0.9rem'
                    }}>
                        {status.text}
                    </div>
                )}

                <div className="dash-card" style={{ padding: '2.5rem', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>ANNOUNCEMENT TITLE</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="e.g. System Maintenance Scheduled"
                                required
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>ALERT TYPE</label>
                            <select 
                                className="form-input" 
                                value={type} 
                                onChange={(e) => setType(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white' }}
                            >
                                <option value="INFO">Information (Blue)</option>
                                <option value="SUCCESS">Success (Green)</option>
                                <option value="WARNING">Warning (Yellow)</option>
                                <option value="ERROR">Critical/Error (Red)</option>
                                <option value="SECURITY">Security Alert (Indigo)</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>MESSAGE CONTENT</label>
                            <textarea 
                                className="form-input" 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="Detailed message for all users..."
                                required
                                rows="5"
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>ACTION URL (OPTIONAL)</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={actionUrl} 
                                onChange={(e) => setActionUrl(e.target.value)} 
                                placeholder="e.g. /dashboard/settings"
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn btn-primary" 
                            style={{ 
                                width: '100%', 
                                padding: '1rem', 
                                borderRadius: '12px', 
                                background: '#5170ff', 
                                color: 'white', 
                                fontWeight: '600', 
                                border: 'none', 
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(81, 112, 255, 0.3)'
                            }}
                        >
                            {loading ? 'Sending Broadcast...' : 'Launch Global Broadcast'}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminBroadcast;
