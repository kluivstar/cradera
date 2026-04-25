import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const res = await api.get('/deposits');
            setDeposits(res.data.deposits);
        } catch (err) {
            setError('Failed to load deposits');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, type) => {
        const adminNotes = window.prompt(`Enter notes for ${type}:`);
        if (adminNotes === null) return; // Cancelled

        setActionLoading(id);
        try {
            await api.post(`/deposits/${id}/${type}`, { adminNotes });
            // Instant update in UI
            setDeposits(deposits.map(d => 
                d._id === id 
                ? { ...d, status: type === 'confirm' ? 'confirmed' : 'rejected', verifiedAt: new Date() } 
                : d
            ));
            fetchDeposits(); // Re-sync to get populated fields like verifiedBy
        } catch (err) {
            alert('Failed to process deposit');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="main-container fade-in">
                <div className="dashboard-header">
                    <h1>Manage Deposits</h1>
                    <p className="dashboard-subtitle">Review and verify user deposit notifications</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <div className="dash-card">
                    <div className="dash-card-header">
                        <h3>Pending & Recent Deposits</h3>
                    </div>
                    <div className="dash-card-body">
                        {loading ? (
                            <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>Loading deposits...</p>
                        ) : deposits.length === 0 ? (
                            <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>No deposit requests found.</p>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User Email</th>
                                            <th>Asset / Amount</th>
                                            <th>TX Hash</th>
                                            <th>Status</th>
                                            <th>Verified By</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deposits.map((d) => (
                                            <tr key={d._id}>
                                                <td>{d.userId?.email}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{d.amount} {d.assetType}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{d.network}</div>
                                                </td>
                                                <td>
                                                    <code style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                                                        {d.txHash.substring(0, 10)}...
                                                    </code>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${d.status}`}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.85rem' }}>{d.verifiedBy?.email || '-'}</span>
                                                </td>
                                                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {d.status === 'pending' ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button 
                                                                className="btn btn-primary" 
                                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                                onClick={() => handleAction(d._id, 'confirm')}
                                                                disabled={actionLoading === d._id}
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button 
                                                                className="btn btn-secondary" 
                                                                style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--color-danger)' }}
                                                                onClick={() => handleAction(d._id, 'reject')}
                                                                disabled={actionLoading === d._id}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Processed</span>
                                                    )}
                                                </td>
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

export default ManageDeposits;
