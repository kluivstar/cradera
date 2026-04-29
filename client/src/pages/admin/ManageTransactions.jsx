import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/transactions/admin');
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch platform transactions');
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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>System Transactions</h1>
                    <p className="dashboard-subtitle">A global view of all user activities and payments.</p>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div></div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Asset</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>No transactions found on the platform.</td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td style={{ fontWeight: '500' }}>{tx.user || 'Unknown'}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                                            <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{tx.asset}</td>
                                            <td>{tx.amount.toLocaleString()}</td>
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
                                            <td>{new Date(tx.date).toLocaleDateString()}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <code style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                    {tx.details?.hash?.substring(0, 12)}...
                                                </code>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageTransactions;
