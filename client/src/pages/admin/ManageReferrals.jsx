import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageReferrals = () => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            // Show users who were referred by someone
            const referredUsers = res.data.users.filter(u => u.referredBy);
            setReferrals(referredUsers);
        } catch (err) {
            console.error('Error fetching referrals');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Referral Network</h1>
                    <p className="dashboard-subtitle">Track how users are joining and who is driving growth.</p>
                </div>

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #eee' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Recent Referrals</h3>
                    </div>
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>New User</th>
                                    <th>Referred By</th>
                                    <th>Referrer Stats</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Joined Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}><div className="loading-spinner"></div></td></tr>
                                ) : referrals.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>No referral activity found.</td></tr>
                                ) : (
                                    referrals.map((u, index) => (
                                        <tr key={index}>
                                            <td>
                                                <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{u.username}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{u.email}</p>
                                            </td>
                                            <td>
                                                <p style={{ fontWeight: '500', fontSize: '0.85rem' }}>{u.referredBy?.username || 'System'}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{u.referredBy?.email}</p>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                        {u.referredBy?.referralCount || 0} Total
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="status-badge status-confirmed">Active</span>
                                            </td>
                                            <td style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                {new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageReferrals;
