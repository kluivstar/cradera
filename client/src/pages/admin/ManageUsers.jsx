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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>User Management</h1>
                        <p style={{ color: 'var(--color-text-secondary)' }}>View and manage platform users and their verification status.</p>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, width: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by email or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.75rem 1rem', borderRadius: '10px' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-screen">
                        <div className="loading-spinner"></div>
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User Details</th>
                                    <th>Account Role</th>
                                    <th>KYC Status</th>
                                    <th>Joined Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥</div>
                                            <p style={{ color: 'var(--color-text-secondary)' }}>No users found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{user.email}</span>
                                                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'monospace' }}>ID: {user.id}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${user.kycStatus === 'verified' ? 'confirmed' : 'pending'}`}>
                                                    {user.kycStatus}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button 
                                                        onClick={() => handleVerifyUser(user.id, user.kycStatus)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}
                                                    >
                                                        {user.kycStatus === 'verified' ? 'Revoke KYC' : 'Verify KYC'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '6px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                                    >
                                                        Delete
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
