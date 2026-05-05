import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [filteredDeposits, setFilteredDeposits] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    useEffect(() => {
        const filtered = deposits.filter(d => 
            d.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.status?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDeposits(filtered);
    }, [searchQuery, deposits]);

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
                <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: '400', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                            Deposit Management
                        </h1>
                        <p className="dashboard-subtitle" style={{ fontSize: '0.875rem', fontWeight: '300' }}>
                            Review, verify, and authorize client funding requests globally.
                        </p>
                    </div>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="Search by email, hash or status..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                fontFamily: 'inherit',
                                border: '1px solid #E5E7EB',
                                background: 'white',
                                padding: '0.625rem 1rem',
                                borderRadius: '10px',
                                width: '100%',
                                outline: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '300'
                            }}
                        />
                    </div>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '12px' }}>{error}</div>}

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="table-wrapper">
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Details</th>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset & Network</th>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TX Hash</th>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification</th>
                                    <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '400', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
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
                                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', opacity: 0.1 }}>
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                                </svg>
                                            </div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>No deposit requests found in the system.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDeposits.map((d) => (
                                        <tr key={d._id} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                                     <span style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '0.875rem' }}>{d.userId?.fullName || 'Unknown User'}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '300' }}>{d.userId?.email}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                                    <span style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '0.8125rem' }}>{d.assetType}</span>
                                                    <span style={{ fontSize: '0.625rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '300' }}>{d.network}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                                    <span style={{ fontWeight: '400', color: 'var(--color-primary)', fontSize: '0.9rem' }}>${d.amount.toLocaleString()}</span>
                                                    <span style={{ fontSize: '0.625rem', color: '#9CA3AF', fontWeight: '300' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <code style={{ background: '#F3F4F6', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '300' }}>
                                                        {d.txHash}
                                                    </code>
                                                    <button onClick={() => copyToClipboard(d.txHash)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-accent)', opacity: 0.7 }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <span className={`status-badge status-${d.status}`} style={{
                                                    padding: '0.25rem 0.625rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.625rem',
                                                    fontWeight: '400',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.02em'
                                                }}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                {d.status === 'confirmed' ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#10B981' }}>Verified</span>
                                                        <span style={{ fontSize: '0.625rem', color: '#9CA3AF', fontWeight: '300' }}>{new Date(d.verifiedAt).toLocaleDateString()}</span>
                                                    </div>
                                                ) : d.status === 'in-progress' ? (
                                                    <span style={{ fontSize: '0.75rem', color: '#5170ff', fontWeight: '400' }}>Processing</span>
                                                ) : d.status === 'rejected' ? (
                                                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '400' }}>Declined</span>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: '400' }}>Pending</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {d.status === 'pending' || d.status === 'in-progress' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(d._id, 'confirm')}
                                                                disabled={actionLoading === d._id}
                                                                className="btn btn-accent"
                                                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '4px', fontWeight: '400' }}
                                                            >
                                                                {actionLoading === d._id ? '...' : 'Verify'}
                                                            </button>
                                                            {d.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleAction(d._id, 'in-progress')}
                                                                    disabled={actionLoading === d._id}
                                                                    style={{ background: '#E0E7FF', color: '#4338CA', border: 'none', padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '4px', fontWeight: '400', cursor: 'pointer' }}
                                                                >
                                                                    {actionLoading === d._id ? '...' : 'Progress'}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleAction(d._id, 'reject')}
                                                                disabled={actionLoading === d._id}
                                                                style={{
                                                                    background: '#FEE2E2',
                                                                    color: '#DC2626',
                                                                    border: 'none',
                                                                    padding: '0.35rem 0.75rem',
                                                                    fontSize: '0.75rem',
                                                                    borderRadius: '4px',
                                                                    fontWeight: '400',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {actionLoading === d._id ? '...' : 'Decline'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9CA3AF', textTransform: 'uppercase' }}>Locked</span>
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
