import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerifyUser = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'verified' ? 'unverified' : 'verified';
        try {
            await api.patch(`/admin/users/${userId}`, { kycStatus: newStatus });
            fetchUsers();
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.includes(searchTerm)
    );

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
                    <div>
                        <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-1)' }}>User Management</h1>
                        <p className="dashboard-subtitle">View and manage platform users and their verification status.</p>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, width: '260px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by email or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-screen">
                        <div className="loading-spinner"></div>
                        <p className="dashboard-subtitle">Loading users...</p>
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Details</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Role</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KYC Status</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Date</th>
                                    <th style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-4)', opacity: 0.1 }}>👥</div>
                                            <p className="dashboard-subtitle">No users found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }}>{user.email}</span>
                                                    <span style={{ fontSize: '9px', color: '#94A3B8', fontFamily: 'monospace' }}>ID: {user.id.substring(0, 12)}...</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`} style={{ fontSize: '9px', padding: '0.1rem 0.4rem' }}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${user.kycStatus === 'verified' ? 'confirmed' : 'pending'}`} style={{ fontSize: '9px', padding: '0.1rem 0.4rem' }}>
                                                    {user.kycStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-secondary)', fontSize: '10px' }}>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)' }}>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        onClick={() => handleVerifyUser(user.id, user.kycStatus)}
                                                        className="btn"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '10px', background: '#F1F5F9', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
                                                    >
                                                        {user.kycStatus === 'verified' ? 'REVOKE' : 'VERIFY'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="btn"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '10px', background: '#FEF2F2', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.1)' }}
                                                    >
                                                        DELETE
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;
