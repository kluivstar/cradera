import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data.users);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const totalUsers = users.filter((u) => u.role === 'user').length;
    const totalAdmins = users.filter((u) => u.role === 'admin').length;

    return (
        <DashboardLayout>
            <div className="main-container fade-in">
                <div className="dashboard-header">
                    <h1>Admin Overview</h1>
                    <p className="dashboard-subtitle">Platform management console</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    <div className="stat-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'white' }}>
                        <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{users.length}</div>
                        <div className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Accounts</div>
                    </div>
                    <div className="stat-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'white' }}>
                        <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{totalUsers}</div>
                        <div className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Users</div>
                    </div>
                    <div className="stat-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'white' }}>
                        <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{totalAdmins}</div>
                        <div className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Admins</div>
                    </div>
                </div>

                {/* User Table */}
                <div className="dash-card dash-card-wide">
                    <div className="dash-card-header">
                        <span className="dash-card-icon">👥</span>
                        <h3>All Users</h3>
                    </div>
                    <div className="dash-card-body">
                        {loading ? (
                            <div className="loading-screen">
                                <div className="loading-spinner"></div>
                                <p>Loading users...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="empty-state">
                                <p className="empty-state-text">No users found</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id}>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge role-${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>{formatDate(u.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
