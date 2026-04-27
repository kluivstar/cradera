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
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>Transaction History</h1>
                    <p className="dashboard-subtitle">Monitor your deposit and activity history.</p>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div></div>
                ) : (
                    <div className="dash-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead style={{ background: '#F9FAFB' }}>
                                    <tr>
                                        <th style={{ padding: '1.25rem 1.5rem' }}>Type</th>
                                        <th>Asset</th>
                                        <th>Amount</th>
                                        <th>Network</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>ID/Hash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '5rem' }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>🧾</div>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>No transactions found yet.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx) => (
                                            <tr key={tx.id}>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ 
                                                            width: '32px', height: '32px', borderRadius: '8px', 
                                                            background: tx.type === 'deposit' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(30, 58, 138, 0.1)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: tx.type === 'deposit' ? 'var(--color-accent)' : 'var(--color-primary)',
                                                            fontSize: '1rem'
                                                        }}>
                                                            {tx.type === 'deposit' ? '↓' : '↑'}
                                                        </div>
                                                        <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{tx.type}</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{tx.asset}</td>
                                                <td style={{ fontWeight: '700' }}>{tx.amount.toLocaleString()}</td>
                                                <td>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                                        {tx.details?.network}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge" style={{ 
                                                        ...getStatusStyle(tx.status),
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700'
                                                    }}>
                                                        {tx.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                                    {new Date(tx.date).toLocaleDateString()}
                                                </td>
                                                <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                                    <code style={{ fontSize: '0.75rem', color: '#9CA3AF', background: '#F3F4F6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                        {tx.details?.hash?.substring(0, 10)}...
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
