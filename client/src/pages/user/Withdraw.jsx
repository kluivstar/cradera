import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Withdraw = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentAccounts, setPaymentAccounts] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    
    // Form states
    const [amount, setAmount] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [accountsRes, withdrawalsRes] = await Promise.all([
                api.get('/payment-accounts'),
                api.get('/withdrawals/me')
            ]);
            
            setPaymentAccounts(accountsRes.data.paymentAccounts);
            setWithdrawals(withdrawalsRes.data.withdrawals);
            
            // Auto-select default account
            const defaultAcc = accountsRes.data.paymentAccounts.find(a => a.isDefault);
            if (defaultAcc) setSelectedAccountId(defaultAcc._id);
            else if (accountsRes.data.paymentAccounts.length > 0) setSelectedAccountId(accountsRes.data.paymentAccounts[0]._id);

            // Redirect if no accounts
            if (accountsRes.data.paymentAccounts.length === 0) {
                // navigate('/dashboard/settings?tab=payment'); 
                // We'll just show a message for now or redirect
            }
        } catch (err) {
            console.error('Error fetching withdrawal data');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const account = paymentAccounts.find(a => a._id === selectedAccountId);
        if (!account) return alert('Please select a payout account');

        try {
            setSubmitting(true);
            await api.post('/withdrawals', {
                amount: parseFloat(amount),
                payoutAccountId: selectedAccountId,
                payoutMethod: account.type
            });
            alert('Withdrawal request submitted successfully');
            setAmount('');
            fetchData(); // Refresh history and balance
        } catch (err) {
            alert(err.response?.data?.error || 'Error submitting withdrawal');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#F59E0B'; // yellow
            case 'processing': return '#3B82F6'; // blue
            case 'paid': return '#10B981'; // green
            case 'rejected': return '#EF4444'; // red
            default: return 'var(--color-text-secondary)';
        }
    };

    if (loading) return <DashboardLayout><div className="loading-spinner"></div></DashboardLayout>;

    if (paymentAccounts.length === 0) {
        return (
            <DashboardLayout>
                <div className="dashboard-content fade-in">
                    <div className="dash-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <div style={{ marginBottom: '1.5rem', color: '#9CA3AF' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                        <h2 style={{ marginBottom: '1rem', fontWeight: '500' }}>No Payout Method Found</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                            You need to add a bank account or crypto wallet address in your settings before you can withdraw funds.
                        </p>
                        <button onClick={() => navigate('/dashboard/settings')} className="btn btn-primary" style={{ background: '#5170ff' }}>
                            Go to Payment Settings
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Withdraw Funds</h1>
                    <p className="dashboard-subtitle">Request a payout to your saved bank or crypto accounts.</p>
                </div>

                <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
                    {/* Withdrawal Form */}
                    <div className="dash-card">
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Available Balance</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: '500', color: '#5170ff' }}>₦{user?.availableBalance?.toLocaleString() || '0.00'}</h2>
                        </div>

                        <form onSubmit={handleWithdraw}>
                            <div className="form-group">
                                <label>Amount (₦)</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                    placeholder="Enter amount" 
                                    required 
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Payout Account</label>
                                <select 
                                    className="form-input" 
                                    value={selectedAccountId} 
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                    required
                                >
                                    {paymentAccounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.accountName} ({acc.type === 'bank' ? acc.bankName : acc.network})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#5170ff' }}>
                                {submitting ? 'Processing...' : 'Withdraw Funds'}
                            </button>
                        </form>
                    </div>

                    {/* Withdrawal History */}
                    <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Withdrawal History</h3>
                        </div>
                        <div className="table-wrapper" style={{ border: 'none' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>No withdrawals yet.</td>
                                        </tr>
                                    ) : (
                                        withdrawals.map(w => (
                                            <tr key={w._id}>
                                                <td style={{ fontWeight: '600' }}>₦{w.amount.toLocaleString()}</td>
                                                <td>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#F3F4F6', color: '#4B5563', textTransform: 'uppercase', fontWeight: '600' }}>
                                                        {w.payoutMethod}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ color: getStatusColor(w.status), fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                        {w.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                    {new Date(w.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Withdraw;
