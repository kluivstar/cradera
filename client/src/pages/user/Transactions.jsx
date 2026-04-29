import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx => {
        const query = searchQuery.toLowerCase();
        return (
            tx.asset?.toLowerCase().includes(query) ||
            tx.status?.toLowerCase().includes(query) ||
            tx.details?.hash?.toLowerCase().includes(query)
        );
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return { background: '#DEF7EC', color: '#03543F' };
            case 'pending': return { background: '#FEF3C7', color: '#92400E' };
            case 'rejected': return { background: '#FDE2E2', color: '#9B1C1C' };
            default: return {};
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Transaction History</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Monitor your deposit and activity history.</p>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div></div>
                ) : (
                    <>
                        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                                <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                                <input 
                                    type="text" 
                                    placeholder="Search by hash, asset, status..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.5rem 1rem 0.5rem 2.25rem', 
                                        fontSize: '0.8125rem', 
                                        borderRadius: '8px', 
                                        border: '1px solid var(--color-border)',
                                        background: '#FFFFFF',
                                        outline: 'none',
                                        fontFamily: 'var(--font-base)',
                                        fontWeight: '500'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead style={{ background: '#F9FAFB' }}>
                                        <tr>
                                            <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                                            <th>Asset</th>
                                            <th>Amount</th>
                                            <th>Network</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th style={{ textAlign: 'right', paddingRight: '1rem' }}>ID/Hash</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', opacity: 0.1 }}>
                                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                                        </svg>
                                                    </div>
                                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>No matching transactions found.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTransactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td style={{ padding: '0.625rem 1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ 
                                                            width: '28px', height: '28px', borderRadius: '6px', 
                                                            background: tx.status === 'confirmed' ? 'rgba(16, 185, 129, 0.08)' : (tx.type === 'deposit' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(30, 58, 138, 0.1)'),
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: tx.status === 'confirmed' ? '#10B981' : (tx.type === 'deposit' ? 'var(--color-accent)' : 'var(--color-primary)'),
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            {tx.status === 'confirmed' ? (
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"/>
                                                                </svg>
                                                            ) : (
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    {tx.type === 'deposit' ? (
                                                                        <path d="M12 5v14M5 12l7 7 7-7"/>
                                                                    ) : (
                                                                        <path d="M12 19V5M5 12l7-7 7 7"/>
                                                                    )}
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span style={{ fontWeight: '500', textTransform: 'capitalize', fontSize: '0.875rem' }}>{tx.type}</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: '500', color: 'var(--color-primary)', fontSize: '0.875rem' }}>{tx.asset}</td>
                                                <td style={{ fontWeight: '500', fontSize: '0.875rem' }}>{tx.amount.toLocaleString()}</td>
                                                <td>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                                                        {tx.details?.network}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge" style={{ 
                                                        ...getStatusStyle(tx.status),
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        {tx.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                                                    {new Date(tx.date).toLocaleDateString()}
                                                </td>
                                                <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                                                    <code style={{ fontSize: '0.7rem', color: '#9CA3AF', background: '#F3F4F6', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                                        {tx.details?.hash?.substring(0, 8)}...
                                                    </code>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
        </DashboardLayout>
    );
};

export default Transactions;
