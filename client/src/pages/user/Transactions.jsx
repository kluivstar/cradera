import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <div className="dash-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 2px 15px rgba(0,0,0,0.03)' }}>
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
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.2 }}>🧾</div>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>No transactions found yet.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td style={{ padding: '0.625rem 1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ 
                                                            width: '28px', height: '28px', borderRadius: '6px', 
                                                            background: tx.type === 'deposit' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(30, 58, 138, 0.1)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: tx.type === 'deposit' ? 'var(--color-accent)' : 'var(--color-primary)',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            {tx.type === 'deposit' ? '↓' : '↑'}
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
                )}
            </div>
        </DashboardLayout>
    );
};

export default Transactions;
