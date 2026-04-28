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
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-8)' }}>
                    <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-1)' }}>
                        Deposit Management
                    </h1>
                    <p className="dashboard-subtitle">
                        Review, verify, and authorize client funding requests globally.
                    </p>
                </div>

                {error && <div style={{ background: '#FEF2F2', color: 'var(--color-danger)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)' }}>{error}</div>}

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Details</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset & Network</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TX Hash</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification</th>
                                    <th style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
                                            <div className="loading-spinner" style={{ margin: '0 auto var(--spacing-4)' }}></div>
                                            <p className="dashboard-subtitle">Synchronizing transactions...</p>
                                        </td>
                                    </tr>
                                ) : deposits.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)', opacity: 0.1 }}>🧾</div>
                                            <p className="dashboard-subtitle">No deposit requests found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    deposits.map((d) => (
                                        <tr key={d._id}>
                                            <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }}>{d.userId?.fullName || 'Unknown User'}</span>
                                                    <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{d.userId?.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }}>{d.assetType}</span>
                                                    <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>{d.network}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>${d.amount.toLocaleString()}</span>
                                                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                                    <code style={{ background: '#F1F5F9', padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)', fontSize: '10px', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {d.txHash}
                                                    </code>
                                                    <button onClick={() => copyToClipboard(d.txHash)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', opacity: 0.5 }}>📋</button>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${d.status}`} style={{
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '9px'
                                                }}>
                                                    {d.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                {d.verifiedBy ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-success)' }}>VERIFIED</span>
                                                        <span style={{ fontSize: '9px', color: '#94A3B8' }}>{new Date(d.verifiedAt).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: '700' }}>PENDING</span>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)' }}>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                                                    {d.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(d._id, 'confirm')}
                                                                disabled={actionLoading === d._id}
                                                                className="btn"
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '10px', background: 'var(--color-primary)', color: 'white' }}
                                                            >
                                                                {actionLoading === d._id ? '...' : 'CONFIRM'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(d._id, 'reject')}
                                                                disabled={actionLoading === d._id}
                                                                style={{
                                                                    background: '#FEF2F2',
                                                                    color: 'var(--color-danger)',
                                                                    border: 'none',
                                                                    padding: '0.4rem 0.8rem',
                                                                    fontSize: '10px',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    fontWeight: '700',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {actionLoading === d._id ? '...' : 'REJECT'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#94A3B8' }}>LOCKED</span>
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
