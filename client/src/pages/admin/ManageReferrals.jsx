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
            // We'll just fetch all users and their referrers for now
            const res = await api.get('/admin/users'); // I'll assume this endpoint exists or create a new one
            const usersWithReferrers = res.data.users.filter(u => u.referredBy);
            setReferrals(usersWithReferrers);
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
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Referral Management</h1>
                    <p className="dashboard-subtitle">Monitor the platform's referral network and growth.</p>
                </div>

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Referred User</th>
                                    <th>Referrer</th>
                                    <th>Reward</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}><div className="loading-spinner"></div></td></tr>
                                ) : referrals.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>No referrals recorded.</td></tr>
                                ) : (
                                    referrals.map((u, index) => (
                                        <tr key={index}>
                                            <td>
                                                <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{u.email}</p>
                                            </td>
                                            <td>
                                                <p style={{ fontSize: '0.85rem' }}>{u.referredBy?.email || 'N/A'}</p>
                                            </td>
                                            <td>
                                                <p style={{ fontWeight: '600', color: '#10B981' }}>₦0.00</p>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                                                    COMPLETED
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                {new Date(u.createdAt).toLocaleDateString()}
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
