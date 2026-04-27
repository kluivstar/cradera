import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    const fetchDeposits = async () => {
        try {
            const res = await api.get('/deposits');
            setDeposits(res.data.deposits);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load deposits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this deposit?`)) return;

        setActionLoading(id);
        try {
            await api.post(`/deposits/${id}/${action}`);
            await fetchDeposits(); // Refresh data
        } catch (err) {
            alert(err.response?.data?.error || `Failed to ${action} deposit`);
        } finally {
            setActionLoading(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Transaction Hash copied!');
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1600px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                        Deposit Management
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '1.1rem' }}>
                        Review, verify, and authorize client funding requests globally.
                    </p>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '12px' }}>{error}</div>}

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
                    <div className="table-wrapper">
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #F3F4F6' }}>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Details</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset & Network</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TX Hash</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification</th>
                                    <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '8rem' }}>
                                            <div className="loading-spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>Synchronizing transactions...</p>
                                        </td>
                                    </tr>
                                ) : deposits.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '8rem' }}>
                                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.1 }}>🧾</div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>No deposit requests found in the system.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    deposits.map((d) => (
                                        <tr key={d._id} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{d.userId?.fullName || 'Unknown User'}</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{d.userId?.email}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{d.assetType}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase' }}>{d.network}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.1rem' }}>${d.amount.toLocaleString()}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <code style={{ background: '#F3F4F6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {d.txHash}
                                                    </code>
                                                    <button onClick={() => copyToClipboard(d.txHash)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', opacity: 0.5 }}>📋</button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <span className={`status-badge status-${d.status}`} style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.02em'
                                                }}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                {d.verifiedBy ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#10B981' }}>Verified by Admin</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(d.verifiedAt).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.85rem', color: '#F59E0B', fontWeight: '600' }}>Pending Verification</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    {d.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(d._id, 'confirm')}
                                                                disabled={actionLoading === d._id}
                                                                className="btn btn-accent"
                                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', fontWeight: '700' }}
                                                            >
                                                                {actionLoading === d._id ? '...' : 'Confirm'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(d._id, 'reject')}
                                                                disabled={actionLoading === d._id}
                                                                style={{
                                                                    background: '#FEE2E2',
                                                                    color: '#DC2626',
                                                                    border: 'none',
                                                                    padding: '0.5rem 1rem',
                                                                    fontSize: '0.8rem',
                                                                    borderRadius: '8px',
                                                                    fontWeight: '700',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {actionLoading === d._id ? '...' : 'Reject'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>Locked</span>
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
            </div>
        </DashboardLayout>
    );
};

export default ManageDeposits;
