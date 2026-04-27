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
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Command Center</h1>
                    <p className="dashboard-subtitle">Real-time overview of Cradera's platform health and operations.</p>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: '2rem' }}>{error}</div>}

                {/* Performance Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="dash-card" style={{ padding: '2rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Users</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>{stats.totalUsers}</h2>
                            <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: '700' }}>Active</span>
                        </div>
                    </div>
                    <Link to="/admin/deposits" style={{ textDecoration: 'none' }}>
                        <div className="dash-card" style={{ padding: '2rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: stats.pendingDeposits > 0 ? 'rgba(56, 189, 248, 0.05)' : 'white' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Deposits</p>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: stats.pendingDeposits > 0 ? 'var(--color-accent)' : 'var(--color-primary)' }}>{stats.pendingDeposits}</h2>
                        </div>
                    </Link>
                    <Link to="/admin/kyc" style={{ textDecoration: 'none' }}>
                        <div className="dash-card" style={{ padding: '2rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: stats.pendingKYC > 0 ? 'rgba(245, 158, 11, 0.05)' : 'white' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KYC Requests</p>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: stats.pendingKYC > 0 ? '#F59E0B' : 'var(--color-primary)' }}>{stats.pendingKYC}</h2>
                        </div>
                    </Link>
                    <div className="dash-card" style={{ padding: '2rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Volume</p>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>₦{(stats.totalVolume || 0).toLocaleString()}</h2>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                    
                    {/* Recent Transactions List */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>Recent System Activity</h3>
                            <Link to="/admin/transactions" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '700', textDecoration: 'none' }}>View Audit Log</Link>
                        </div>
                        <div className="dash-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.04)' }}>
                            {loading ? (
                                <div style={{ padding: '4rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                            ) : recentActivity.length === 0 ? (
                                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No recent activity.</div>
                            ) : (
                                <div className="table-wrapper" style={{ border: 'none' }}>
                                    <table className="data-table">
                                        <thead style={{ background: '#F8FAFC' }}>
                                            <tr>
                                                <th style={{ padding: '1rem 1.5rem' }}>User</th>
                                                <th>Asset</th>
                                                <th>Amount</th>
                                                <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentActivity.map(tx => (
                                                <tr key={tx.id}>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{tx.user?.split('@')[0]}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</p>
                                                    </td>
                                                    <td style={{ fontWeight: '600' }}>{tx.asset}</td>
                                                    <td style={{ fontWeight: '700' }}>₦{tx.amount.toLocaleString()}</td>
                                                    <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                                        <span className={`status-badge status-${tx.status === 'confirmed' ? 'confirmed' : 'pending'}`} style={{ fontSize: '0.65rem', fontWeight: '800' }}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)' }}>Newest Members</h3>
                            <Link to="/admin/users" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '700', textDecoration: 'none' }}>Manage Users</Link>
                        </div>
                        <div className="dash-card" style={{ padding: '1.5rem', border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.04)' }}>
                            {loading ? (
                                <div style={{ padding: '2rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                            ) : recentUsers.length === 0 ? (
                                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>No members yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {recentUsers.map(u => (
                                        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '12px', background: '#F9FAFB' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                                                    {u.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)' }}>{u.email}</p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: u.kycStatus === 'verified' ? 'var(--color-accent)' : '#9CA3AF' }}>
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
