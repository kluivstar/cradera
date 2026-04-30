import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await api.get('/withdrawals');
            setWithdrawals(res.data.withdrawals);
        } catch (err) {
            console.error('Error fetching withdrawals');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            setProcessingId(id);
            const adminNotes = prompt(`Enter notes for this ${action}:`);
            await api.post(`/withdrawals/${id}/${action}`, { adminNotes });
            alert(`Withdrawal ${action} successfully`);
            fetchWithdrawals();
        } catch (err) {
            alert(err.response?.data?.error || `Error during ${action}`);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase'
        };

        switch (status) {
            case 'pending': return <span style={{ ...styles, background: '#FEF3C7', color: '#B45309' }}>Pending</span>;
            case 'processing': return <span style={{ ...styles, background: '#DBEAFE', color: '#1E40AF' }}>Processing</span>;
            case 'paid': return <span style={{ ...styles, background: '#D1FAE5', color: '#065F46' }}>Paid</span>;
            case 'rejected': return <span style={{ ...styles, background: '#FEE2E2', color: '#991B1B' }}>Rejected</span>;
            default: return <span>{status}</span>;
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Manage Withdrawals</h1>
                    <p className="dashboard-subtitle">Review and process platform withdrawal requests.</p>
                </div>

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}><div className="loading-spinner"></div></td></tr>
                                ) : withdrawals.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>No withdrawal requests found.</td></tr>
                                ) : (
                                    withdrawals.map(w => (
                                        <tr key={w._id}>
                                            <td>
                                                <p style={{ fontWeight: '500', fontSize: '0.85rem' }}>{w.userId?.email}</p>
                                            </td>
                                            <td style={{ fontWeight: '600' }}>₦{w.amount.toLocaleString()}</td>
                                            <td>
                                                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#6B7280' }}>{w.payoutMethod.toUpperCase()}</span>
                                            </td>
                                            <td>
                                                {w.payoutAccountId ? (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                        {w.payoutMethod === 'bank' ? (
                                                            <p>{w.payoutAccountId.bankName} • {w.payoutAccountId.accountNumber}</p>
                                                        ) : (
                                                            <p>{w.payoutAccountId.network} • {w.payoutAccountId.cryptoWalletAddress.substring(0, 12)}...</p>
                                                        )}
                                                    </div>
                                                ) : <span style={{ color: 'red' }}>Account Deleted</span>}
                                            </td>
                                            <td>{getStatusBadge(w.status)}</td>
                                            <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                {new Date(w.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    {w.status === 'pending' && (
                                                        <button 
                                                            onClick={() => handleAction(w._id, 'process')}
                                                            disabled={processingId === w._id}
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                        >
                                                            Process
                                                        </button>
                                                    )}
                                                    {(w.status === 'pending' || w.status === 'processing') && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleAction(w._id, 'pay')}
                                                                disabled={processingId === w._id}
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                Mark Paid
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAction(w._id, 'reject')}
                                                                disabled={processingId === w._id}
                                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
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

export default ManageWithdrawals;
