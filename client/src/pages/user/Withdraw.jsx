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
            <DashboardLayout title="Withdraw Funds">
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
        <DashboardLayout title="Withdraw Funds">
            <div className="dashboard-content fade-in">
                <div className="dashboard-header-responsive" style={{ marginBottom: '2.5rem' }}>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '300' }}>Request a payout to your saved bank or crypto accounts.</p>
                </div>

                <div className="withdrawal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                    {/* Withdrawal Form */}
                    <div className="dash-card" style={{ padding: '2rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #5170ff 0%, #3b5bdb 100%)', 
                            padding: '1.5rem', 
                            borderRadius: '12px', 
                            color: 'white', 
                            marginBottom: '2rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.5rem' }}>Available Balance</p>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '600' }}>₦{user?.availableBalance?.toLocaleString() || '0.00'}</h2>
                            </div>
                            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', fontSize: '5rem', opacity: 0.1, transform: 'rotate(-15deg)', fontWeight: '900' }}>₦</div>
                        </div>

                        <form onSubmit={handleWithdraw}>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase' }}>AMOUNT (₦)</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontWeight: '600' }}>₦</span>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        placeholder="0.00" 
                                        required 
                                        min="1"
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.2rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '1.1rem', fontWeight: '500' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase' }}>PAYOUT ACCOUNT</label>
                                <select 
                                    className="form-input" 
                                    value={selectedAccountId} 
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.95rem', background: 'white' }}
                                >
                                    {paymentAccounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.accountName} — {acc.type === 'bank' ? acc.bankName : acc.network}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#5170ff', border: 'none', color: 'white', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(81, 112, 255, 0.3)' }}>
                                {submitting ? 'Processing...' : 'Withdraw Funds'}
                            </button>
                        </form>
                    </div>

                    {/* Withdrawal History */}
                    <div className="dash-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-primary)' }}>Withdrawal History</h3>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '500' }}>Recent Requests</span>
                        </div>
                        <div className="table-wrapper" style={{ border: 'none' }}>
                            <table className="data-table">
                                <thead>
                                    <tr style={{ background: '#F8FAFC' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.7rem', color: '#64748B' }}>AMOUNT</th>
                                        <th style={{ fontSize: '0.7rem', color: '#64748B' }}>STATUS</th>
                                        <th style={{ textAlign: 'right', paddingRight: '1.5rem', fontSize: '0.7rem', color: '#64748B' }}>DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
                                                <div style={{ marginBottom: '1rem' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                                                No withdrawals yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        withdrawals.map(w => (
                                            <tr key={w._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <div style={{ fontWeight: '600', color: 'var(--color-primary)', fontSize: '1rem' }}>₦{w.amount.toLocaleString()}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', marginTop: '0.2rem' }}>{w.payoutMethod}</div>
                                                </td>
                                                <td>
                                                    <span style={{ 
                                                        color: getStatusColor(w.status), 
                                                        background: `${getStatusColor(w.status)}15`,
                                                        padding: '0.35rem 0.75rem', 
                                                        borderRadius: '6px',
                                                        fontWeight: '600', 
                                                        fontSize: '0.7rem', 
                                                        textTransform: 'uppercase' 
                                                    }}>
                                                        {w.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right', paddingRight: '1.5rem', color: '#64748B', fontSize: '0.85rem' }}>
                                                    {new Date(w.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
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
