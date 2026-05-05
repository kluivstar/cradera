import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageAdminLogs = () => {
    const [admins, setAdmins] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('admins');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [adminsRes, logsRes] = await Promise.all([
                api.get('/admin/admins'),
                api.get('/admin/activity-logs')
            ]);
            setAdmins(adminsRes.data.admins);
            setLogs(logsRes.data.logs);
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderAdminsTable = () => (
        <div className="table-wrapper" style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.03)', border: 'none' }}>
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{ fontWeight: '400' }}>Admin Details</th>
                        <th style={{ fontWeight: '400' }}>Role</th>
                        <th style={{ fontWeight: '400' }}>Joined Date</th>
                        <th style={{ fontWeight: '400' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', fontWeight: '300' }}>No admins found.</td>
                        </tr>
                    ) : (
                        admins.map((admin) => (
                            <tr key={admin._id}>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '0.875rem' }}>{admin.email}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '300' }}>@{admin.username || 'no-username'}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="role-badge role-admin" style={{ fontWeight: '300' }}>{admin.role}</span>
                                </td>
                                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: '300' }}>
                                    {new Date(admin.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className="status-badge status-confirmed" style={{ fontSize: '0.7rem', fontWeight: '300' }}>Active</span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderLogsTable = () => (
        <div className="table-wrapper" style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.03)', border: 'none' }}>
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{ fontWeight: '400' }}>Admin</th>
                        <th style={{ fontWeight: '400' }}>Action</th>
                        <th style={{ fontWeight: '400' }}>Details</th>
                        <th style={{ fontWeight: '400' }}>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', fontWeight: '300' }}>No activity logs found.</td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log._id}>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '0.8125rem' }}>{log.adminId?.username}</span>
                                        <span style={{ fontSize: '0.625rem', color: '#9CA3AF', fontWeight: '300' }}>{log.adminId?.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ 
                                        fontSize: '0.7rem', 
                                        fontWeight: '400',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        background: log.action.includes('VERIFIED') ? '#dcfce7' : log.action.includes('DECLINED') ? '#fee2e2' : '#eff6ff',
                                        color: log.action.includes('VERIFIED') ? '#166534' : log.action.includes('DECLINED') ? '#991b1b' : '#1e40af'
                                    }}>
                                        {log.action.replace('_', ' ')}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '300' }}>
                                    {log.details}
                                </td>
                                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', fontWeight: '300' }}>
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '400', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Admin & Activity Log</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '300' }}>Monitor administrative actions and manage platform administrators.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                    <button 
                        onClick={() => setActiveTab('admins')}
                        style={{ 
                            padding: '0.75rem 1rem', 
                            background: 'none', 
                            border: 'none', 
                            borderBottom: activeTab === 'admins' ? '2px solid #5170ff' : '2px solid transparent',
                            color: activeTab === 'admins' ? '#5170ff' : '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: activeTab === 'admins' ? '400' : '300',
                            transition: 'all 0.2s'
                        }}
                    >
                        Admin Management
                    </button>
                    <button 
                        onClick={() => setActiveTab('logs')}
                        style={{ 
                            padding: '0.75rem 1rem', 
                            background: 'none', 
                            border: 'none', 
                            borderBottom: activeTab === 'logs' ? '2px solid #5170ff' : '2px solid transparent',
                            color: activeTab === 'logs' ? '#5170ff' : '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: activeTab === 'logs' ? '400' : '300',
                            transition: 'all 0.2s'
                        }}
                    >
                        Activity Log
                    </button>
                </div>

                {loading ? (
                    <div className="loading-screen">
                        <div className="loading-spinner"></div>
                        <p style={{ fontWeight: '300' }}>Fetching logs...</p>
                    </div>
                ) : (
                    activeTab === 'admins' ? renderAdminsTable() : renderLogsTable()
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageAdminLogs;
