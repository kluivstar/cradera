import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Deposit = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        assetType: 'USDT',
        network: 'TRC20',
        amount: '',
        txHash: '',
        fromAddress: ''
    });

    const walletAddress = "TXYZ1234567890ABCDEFGHIJKLMN"; // Placeholder platform wallet

    const fetchHistory = async () => {
        try {
            const res = await api.get('/deposits/me');
            setDeposits(res.data.deposits);
        } catch (err) {
            console.error('Failed to fetch deposits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/deposits', {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setSuccess('Deposit request submitted successfully!');
            setFormData({
                assetType: 'USDT',
                network: 'TRC20',
                amount: '',
                txHash: '',
                fromAddress: ''
            });
            fetchHistory();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit deposit');
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletAddress);
        alert('Address copied to clipboard!');
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                        Fund Account
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '1.1rem' }}>
                        Securely deposit assets using our multi-network institutional gateway.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                    gap: '2.5rem',
                    alignItems: 'start'
                }}>
                    {/* Left Column: Flow & Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        {/* Step-by-Step Guide */}
                        <div className="dash-card" style={{ 
                            background: 'var(--color-primary)', 
                            color: 'white',
                            padding: '2.5rem',
                            border: 'none',
                            boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)'
                        }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem' }}>How to deposit</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {[
                                        { step: 1, text: "Copy the platform wallet address below." },
                                        { step: 2, text: "Send funds from your external wallet/exchange." },
                                        { step: 3, text: "Fill the submission form with transaction proof." }
                                    ].map((item) => (
                                        <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '28px', 
                                                height: '28px', 
                                                borderRadius: '50%', 
                                                background: 'rgba(255,255,255,0.2)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: '700'
                                            }}>
                                                {item.step}
                                            </div>
                                            <p style={{ fontSize: '0.95rem', opacity: 0.9 }}>{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ 
                                background: 'rgba(255,255,255,0.08)', 
                                padding: '1.5rem', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', opacity: 0.6 }}>
                                    Your {formData.assetType} ({formData.network}) Deposit Address
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <code style={{ fontSize: '1rem', wordBreak: 'break-all', fontWeight: '500', flex: 1 }}>
                                        {walletAddress}
                                    </code>
                                    <button 
                                        onClick={copyToClipboard}
                                        style={{ 
                                            background: 'var(--color-accent)', 
                                            color: 'var(--color-primary)', 
                                            border: 'none', 
                                            padding: '0.6rem 1.25rem', 
                                            borderRadius: '8px', 
                                            fontSize: '0.85rem', 
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submission Form */}
                        <div className="dash-card" style={{ padding: '2.5rem' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: '600' }}>Confirm Transaction</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Notify our system once payment is sent.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                                {success && <div style={{ background: '#ECFDF5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #10B98133' }}>{success}</div>}
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Asset Type</label>
                                        <select name="assetType" value={formData.assetType} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}>
                                            <option value="USDT">USDT (Tether)</option>
                                            <option value="BTC">Bitcoin</option>
                                            <option value="ETH">Ethereum</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Network</label>
                                        <select name="network" value={formData.network} onChange={handleChange} required style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}>
                                            <option value="TRC20">Tron (TRC20)</option>
                                            <option value="ERC20">Ethereum (ERC20)</option>
                                            <option value="BEP20">BSC (BEP20)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Amount Sent (USD)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontWeight: '600' }}>$</span>
                                        <input 
                                            type="number" 
                                            name="amount" 
                                            value={formData.amount} 
                                            onChange={handleChange} 
                                            placeholder="0.00" 
                                            required 
                                            style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Transaction Hash (TXID)</label>
                                    <input 
                                        type="text" 
                                        name="txHash" 
                                        value={formData.txHash} 
                                        onChange={handleChange} 
                                        placeholder="Paste hash here" 
                                        required 
                                        style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Your Wallet Address (From)</label>
                                    <input 
                                        type="text" 
                                        name="fromAddress" 
                                        value={formData.fromAddress} 
                                        onChange={handleChange} 
                                        placeholder="Enter sending address" 
                                        required 
                                        style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-accent" 
                                    disabled={submitting} 
                                    style={{ width: '100%', padding: '1.15rem', fontSize: '1rem', fontWeight: '700', borderRadius: '12px' }}
                                >
                                    {submitting ? 'Processing Transaction...' : 'I Have Made Payment'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: History */}
                    <div className="dash-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: '600' }}>Recent Deposits</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Status tracking for your funding requests.</p>
                            </div>
                            <button onClick={fetchHistory} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>Refresh</button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                            </div>
                        ) : deposits.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}>📦</div>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>No transaction history available yet.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                                            <th style={{ padding: '1rem 0' }}>Asset Details</th>
                                            <th style={{ padding: '1rem 0' }}>Value</th>
                                            <th style={{ padding: '1rem 0' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deposits.map((d) => (
                                            <tr key={d._id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                                <td style={{ padding: '1.25rem 0' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1rem' }}>{d.assetType}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{d.network}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 0' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>${d.amount.toLocaleString()}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 0' }}>
                                                    <span className={`status-badge status-${d.status}`} style={{ 
                                                        padding: '0.4rem 0.8rem', 
                                                        borderRadius: '6px', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.02em'
                                                    }}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Deposit;
