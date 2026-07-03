import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Tracking state
    const [activeTx, setActiveTx] = useState(null);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [loadingTimeline, setLoadingTimeline] = useState(false);
    
    // Form update state
    const [newStatus, setNewStatus] = useState('INITIATED');
    const [adminAction, setAdminAction] = useState('Investigate');
    const [comment, setComment] = useState('');

    // Filter states
    const [filterCategory, setFilterCategory] = useState('ALL'); // ALL, PENDING, STUCK, COMPLETED, FAILED

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/transactions/admin');
            setTransactions(res.data);
        } catch (err) {
            setError('Failed to fetch platform transactions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTimeline = async (txId) => {
        setLoadingTimeline(true);
        try {
            const res = await api.get(`/timeline/${txId}`);
            setTimelineEvents(res.data.events || []);
            setNewStatus(res.data.currentStatus || 'INITIATED');
        } catch (err) {
            console.error('Failed to load timeline events', err);
        } finally {
            setLoadingTimeline(false);
        }
    };

    const handleOpenTracker = (tx) => {
        setActiveTx(tx);
        fetchTimeline(tx.id);
        setComment('');
    };

    const handleProgressUpdate = async (e) => {
        e.preventDefault();
        if (!comment) {
            setError('Please provide a comment for this timeline update.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            await api.patch(`/timeline/admin/${activeTx.id}`, {
                status: newStatus,
                description: comment,
                adminAction
            });

            setSuccess(`Updated tracking timeline for transaction #${activeTx.id.substring(activeTx.id.length - 8)}`);
            setActiveTx(null);
            fetchTransactions();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update timeline.');
        }
    };

    // Helper to determine if a transaction is "Stuck" (Not finished and older than 1 hour)
    const isTransactionStuck = (tx) => {
        const status = tx.status?.toLowerCase();
        if (['pending', 'processing', 'deposit_detected', 'blockchain_confirming', 'payout_sent'].includes(status) || !['confirmed', 'paid', 'completed', 'rejected', 'failed'].includes(status)) {
            const ageInMs = new Date() - new Date(tx.date);
            return ageInMs > 60 * 60 * 1000; // 1 hour
        }
        return false;
    };

    // Filter transactions list
    const filteredTransactions = transactions.filter(tx => {
        const s = tx.status?.toLowerCase();
        if (filterCategory === 'COMPLETED') return ['confirmed', 'paid', 'completed'].includes(s);
        if (filterCategory === 'FAILED') return ['rejected', 'failed'].includes(s);
        if (filterCategory === 'STUCK') return isTransactionStuck(tx);
        if (filterCategory === 'PENDING') return ['pending', 'processing', 'initiated', 'deposit_detected', 'blockchain_confirming', 'payout_sent'].includes(s) && !isTransactionStuck(tx);
        return true;
    });

    const getStatusStyle = (status) => {
        const s = status.toLowerCase();
        if (['confirmed', 'paid', 'completed'].includes(s)) return { background: '#DEF7EC', color: '#03543F' };
        if (['pending', 'processing', 'initiated'].includes(s)) return { background: '#FEF3C7', color: '#92400E' };
        if (['rejected', 'failed'].includes(s)) return { background: '#FDE2E2', color: '#9B1C1C' };
        return { background: '#F3F4F6', color: '#374151' };
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ textAlign: 'left' }}>
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '500', color: 'var(--color-primary)' }}>System Transactions</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Monitor progress states, track stuck payments, and transition timelines.</p>
                </div>

                {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                {success && <div className="alert-banner" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '1.5rem' }}>{success}</div>}

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    {['ALL', 'PENDING', 'STUCK', 'COMPLETED', 'FAILED'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: '15px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                background: filterCategory === cat ? 'var(--color-primary)' : 'transparent',
                                color: filterCategory === cat ? 'white' : 'var(--color-text-secondary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                ) : (
                    <div className="dash-card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Type</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Asset</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Amount</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No matching platform transactions found.</td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((tx) => {
                                        const stuck = isTransactionStuck(tx);
                                        return (
                                            <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{tx.user || 'Unknown'}</td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textTransform: 'capitalize' }}>{tx.type}</td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary)' }}>{tx.asset}</td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{tx.amount.toLocaleString()}</td>
                                                <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    <span className="status-badge" style={{ 
                                                        ...getStatusStyle(tx.status),
                                                        padding: '0.2rem 0.5rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {tx.status}
                                                    </span>
                                                    {stuck && (
                                                        <span style={{ fontSize: '0.65rem', background: '#FEE2E2', color: '#EF4444', fontWeight: '700', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>STUCK</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                    <button 
                                                        onClick={() => handleOpenTracker(tx)}
                                                        style={{
                                                            border: 'none',
                                                            background: 'var(--color-primary)',
                                                            color: 'white',
                                                            padding: '0.35rem 0.75rem',
                                                            borderRadius: '5px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Track & Action
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tracker Progression Modal */}
                {activeTx && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="auth-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', background: 'white', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>Progress Control: #{activeTx.id.substring(activeTx.id.length - 8)}</h3>
                                <button onClick={() => setActiveTx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>

                            <form onSubmit={handleProgressUpdate}>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>TRANSITION STATUS</label>
                                    <select 
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                    >
                                        <option value="INITIATED">INITIATED</option>
                                        <option value="DEPOSIT_DETECTED">DEPOSIT_DETECTED</option>
                                        <option value="BLOCKCHAIN_CONFIRMING">BLOCKCHAIN_CONFIRMING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="PAYOUT_SENT">PAYOUT_SENT</option>
                                        <option value="COMPLETED">COMPLETED (Finalize Balance)</option>
                                        <option value="FAILED">FAILED (Finalize Reject / Revert)</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>ADMIN ACTION</label>
                                    <select 
                                        value={adminAction}
                                        onChange={(e) => setAdminAction(e.target.value)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                    >
                                        <option value="Investigate">Investigate</option>
                                        <option value="Retry">Retry</option>
                                        <option value="Mark Completed">Mark Completed</option>
                                        <option value="Mark Failed">Mark Failed</option>
                                        <option value="Escalate">Escalate</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>TRANSITION COMMENT</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Verifying tx hash on Solscan"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem' }}>
                                    Push Progress Update
                                </button>
                            </form>

                            {/* Timeline Log History */}
                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', textAlign: 'left' }}>
                                <h4 style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.75rem' }}>Tracking Logs</h4>
                                {loadingTimeline ? (
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Loading tracking history...</p>
                                ) : timelineEvents.length === 0 ? (
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>No status logs recorded.</p>
                                ) : (
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                                        {timelineEvents.map(e => (
                                            <div key={e._id} style={{ fontSize: '0.8rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: 'var(--color-primary)' }}>
                                                    <span>{e.status}</span>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{new Date(e.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <p style={{ margin: '0.15rem 0 0 0', color: 'var(--color-text-secondary)' }}>{e.description}</p>
                                                {e.metadata?.adminAction && (
                                                    <span style={{ fontSize: '0.65rem', background: '#f1f5f9', padding: '0.05rem 0.35rem', borderRadius: '3px', marginTop: '0.15rem', display: 'inline-block' }}>
                                                        Action: {e.metadata.adminAction}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageTransactions;
