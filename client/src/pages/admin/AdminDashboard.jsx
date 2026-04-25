import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, pendingDeposits: 0, pendingKYC: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users')
                ]);
                setStats(statsRes.data.stats);
                setUsers(usersRes.data.users);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>Admin Home</h1>
                    <p className="dashboard-subtitle">Platform health and operational summary</p>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: '2rem' }}>{error}</div>}

                {/* Stats Row */}
                <div className="stats-grid" style={{ marginBottom: '3rem' }}>
                    <div className="stat-card">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value" style={{ color: 'var(--color-primary)' }}>{stats.totalUsers}</div>
                    </div>
                    <Link to="/admin/deposits" className="stat-card" style={{ textDecoration: 'none' }}>
                        <div className="stat-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pending Deposits</span>
                            <span style={{ fontSize: '1.2rem', filter: 'grayscale(1)', opacity: 0.6 }}>💰</span>
                        </div>
                        <div className="stat-value" style={{ color: stats.pendingDeposits > 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                            {stats.pendingDeposits}
                        </div>
                    </Link>
                    <div className="stat-card">
                        <div className="stat-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Pending KYC</span>
                            <span style={{ fontSize: '1.2rem', filter: 'grayscale(1)', opacity: 0.6 }}>🛡️</span>
                        </div>
                        <div className="stat-value" style={{ color: stats.pendingKYC > 0 ? 'var(--color-warning)' : 'var(--color-primary)' }}>
                            {stats.pendingKYC}
                        </div>
                    </div>
                </div>

                {/* Recent Users Section */}
                <div className="dash-card dash-card-wide">
                    <div className="dash-card-header">
                        <span className="dash-card-icon" style={{ filter: 'grayscale(1)', opacity: 0.7 }}>👥</span>
                        <h3 style={{ color: 'var(--color-primary)' }}>Recent User Signups</h3>
                    </div>
                    <div className="dash-card-body">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="loading-spinner"></div>
                                <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading user data...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="empty-state">
                                <p className="empty-state-text">No users yet</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>KYC</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.slice(0, 5).map((u) => (
                                            <tr key={u.id}>
                                                <td style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{u.email}</td>
                                                <td>
                                                    <span className={`status-badge status-${u.kycStatus || 'pending'}`} style={{ fontSize: '0.7rem' }}>
                                                        {u.kycStatus || 'unverified'}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(u.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                            <Link to="/admin/users" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                View all users →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
