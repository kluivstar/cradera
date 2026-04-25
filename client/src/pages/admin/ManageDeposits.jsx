import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const res = await api.get('/deposits/admin/all');
                setDeposits(res.data.deposits);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load deposits');
            } finally {
                setLoading(false);
            }
        };
        fetchDeposits();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/deposits/${id}/status`, { status });
            setDeposits(deposits.map(d => d._id === id ? { ...d, status } : d));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <DashboardLayout>
            <div className="fade-in">
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>Manage Deposits</h1>
                    <p className="dashboard-subtitle">Review and authorize client funding requests</p>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: '2rem' }}>{error}</div>}

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Amount</th>
                                <th>Currency</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                                        <div className="loading-spinner"></div>
                                        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading transactions...</p>
                                    </td>
                                </tr>
                            ) : deposits.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>No deposit requests found.</p>
                                    </td>
                                </tr>
                            ) : (
                                deposits.map((deposit) => (
                                    <tr key={deposit._id}>
                                        <td style={{ fontWeight: '500' }}>{deposit.user?.email}</td>
                                        <td>{deposit.amount.toLocaleString()}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{deposit.currency}</td>
                                        <td>
                                            <span className={`status-badge status-${deposit.status}`}>
                                                {deposit.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>
                                            {new Date(deposit.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {deposit.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => updateStatus(deposit._id, 'confirmed')}
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus(deposit._id, 'rejected')}
                                                            className="btn btn-secondary"
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {deposit.status !== 'pending' && (
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                                        Processed
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageDeposits;
