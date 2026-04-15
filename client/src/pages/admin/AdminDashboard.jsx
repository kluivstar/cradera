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
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1>Admin Overview</h1>
                    <p className="dashboard-subtitle">Platform management console</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{users.length}</div>
                        <div className="stat-label">Total Accounts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalUsers}</div>
                        <div className="stat-label">Users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalAdmins}</div>
                        <div className="stat-label">Admins</div>
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
