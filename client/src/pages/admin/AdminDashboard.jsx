import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, pendingDeposits: 0, pendingKYC: 0, totalVolume: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, usersRes, activityRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users'),
                    api.get('/transactions/admin')
                ]);
                setStats(statsRes.data.stats);
                setRecentUsers(usersRes.data.users.slice(0, 5));
                setRecentActivity(activityRes.data.slice(0, 5));
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-8)' }}>
                    <h1 style={{ color: 'var(--color-primary)' }}>Command Center</h1>
                    <p className="dashboard-subtitle">Real-time overview of Cradera's platform health and operations.</p>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: 'var(--spacing-6)' }}>{error}</div>}

                {/* Performance Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-10)' }}>
                    <div className="dash-card" style={{ padding: 'var(--spacing-6)' }}>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Users</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-2)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>{stats.totalUsers}</h2>
                            <span style={{ color: 'var(--color-accent)', fontSize: '11px', fontWeight: '700' }}>Active</span>
                        </div>
                    </div>
                    <Link to="/admin/deposits" style={{ textDecoration: 'none' }}>
                        <div className="dash-card" style={{ padding: 'var(--spacing-6)', background: stats.pendingDeposits > 0 ? 'rgba(56, 189, 248, 0.05)' : 'white' }}>
                            <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Deposits</p>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', color: stats.pendingDeposits > 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{stats.pendingDeposits}</h2>
                        </div>
                    </Link>
                    <Link to="/admin/kyc" style={{ textDecoration: 'none' }}>
                        <div className="dash-card" style={{ padding: 'var(--spacing-6)', background: stats.pendingKYC > 0 ? 'rgba(245, 158, 11, 0.05)' : 'white' }}>
                            <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KYC Requests</p>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', color: stats.pendingKYC > 0 ? '#F59E0B' : 'var(--color-primary)' }}>{stats.pendingKYC}</h2>
                        </div>
                    </Link>
                    <div className="dash-card" style={{ padding: 'var(--spacing-6)' }}>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Volume</p>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)' }}>₦{(stats.totalVolume || 0).toLocaleString()}</h2>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-8)' }}>
                    
                    {/* Recent Transactions List */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-primary)' }}>Recent System Activity</h3>
                            <Link to="/admin/transactions" style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: '700', textDecoration: 'none' }}>VIEW AUDIT LOG</Link>
                        </div>
                        <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                            {loading ? (
                                <div style={{ padding: 'var(--spacing-10)', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                            ) : recentActivity.length === 0 ? (
                                <div style={{ padding: 'var(--spacing-10)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>No recent activity.</div>
                            ) : (
                                <div className="table-wrapper" style={{ border: 'none' }}>
                                    <table className="data-table">
                                        <thead style={{ background: '#F8FAFC' }}>
                                            <tr>
                                                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>User</th>
                                                <th>Asset</th>
                                                <th>Amount</th>
                                                <th style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentActivity.map(tx => (
                                                <tr key={tx.id}>
                                                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                                                        <p style={{ fontWeight: '600', fontSize: 'var(--font-size-xs)' }}>{tx.user?.split('@')[0]}</p>
                                                        <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</p>
                                                    </td>
                                                    <td style={{ fontWeight: '600', fontSize: 'var(--font-size-xs)' }}>{tx.asset}</td>
                                                    <td style={{ fontWeight: '700', fontSize: 'var(--font-size-xs)' }}>₦{tx.amount.toLocaleString()}</td>
                                                    <td style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)' }}>
                                                        <span className={`status-badge status-${tx.status === 'confirmed' ? 'confirmed' : 'pending'}`} style={{ fontSize: '9px' }}>
                                                            {tx.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* New Signups List */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-primary)' }}>Newest Members</h3>
                            <Link to="/admin/users" style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: '700', textDecoration: 'none' }}>MANAGE USERS</Link>
                        </div>
                        <div className="dash-card" style={{ padding: 'var(--spacing-6)' }}>
                            {loading ? (
                                <div style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                            ) : recentUsers.length === 0 ? (
                                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', fontSize: 'var(--font-size-xs)' }}>No members yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                    {recentUsers.map(u => (
                                        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', border: '1px solid var(--color-border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: 'var(--font-size-xs)' }}>
                                                    {u.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: '700', color: 'var(--color-primary)' }}>{u.email}</p>
                                                    <p style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '9px', fontWeight: '800', color: u.kycStatus === 'verified' ? 'var(--color-accent)' : '#9CA3AF' }}>
                                                {u.kycStatus === 'verified' ? 'VERIFIED' : 'PENDING'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
