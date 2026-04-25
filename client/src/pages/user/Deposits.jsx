import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Deposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        assetType: 'USDT',
        network: 'TRC-20',
        amount: '',
        txHash: '',
        fromAddress: '',
        toAddress: 'TLYS1x...Z8y2jQ' // Example static address
    });

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const res = await api.get('/deposits/me');
            setDeposits(res.data.deposits);
        } catch (err) {
            console.error('Failed to fetch deposits');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/deposits', formData);
            setSuccess('Deposit proof submitted successfully. Pending verification.');
            setFormData({
                ...formData,
                amount: '',
                txHash: '',
                fromAddress: ''
            });
            fetchDeposits();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit deposit');
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Address copied to clipboard');
    };

    return (
        <DashboardLayout>
            <div className="main-container fade-in">
                <div className="dashboard-header">
                    <h1>Deposit Assets</h1>
                    <p className="dashboard-subtitle">Fund your account with digital assets</p>
                </div>

                <div className="grid-2">
                    {/* Instruction Card */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h3>Deposit Instructions</h3>
                        </div>
                        <div className="dash-card-body">
                            <p className="mb-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Send your <strong>{formData.assetType}</strong> only via the <strong>{formData.network}</strong> network.
                                Deposits sent to the wrong network will be lost.
                            </p>
                            
                            <div className="input-group" style={{ marginTop: '20px' }}>
                                <label className="input-label">Our Wallet Address ({formData.network})</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input 
                                        className="input-field" 
                                        value={formData.toAddress} 
                                        readOnly 
                                        style={{ background: '#F9FAFB', cursor: 'default' }}
                                    />
                                    <button 
                                        className="btn btn-secondary" 
                                        onClick={() => copyToClipboard(formData.toAddress)}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '12px', background: '#F0F9FF', borderRadius: '8px', border: '1px solid #E0F2FE' }}>
                                <p style={{ fontSize: '0.8rem', color: '#0369A1' }}>
                                    <strong>Note:</strong> After sending the funds, please fill the form on the right with your transaction details to notify our team.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Deposit Form */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <h3>Submit Deposit Proof</h3>
                        </div>
                        <div className="dash-card-body">
                            {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}
                            {success && (
                                <div style={{ background: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid-2">
                                    <div className="input-group">
                                        <label className="input-label">Asset</label>
                                        <select className="input-field" name="assetType" value={formData.assetType} onChange={handleChange}>
                                            <option value="USDT">USDT</option>
                                            <option value="BTC">BTC</option>
                                            <option value="ETH">ETH</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Network</label>
                                        <select className="input-field" name="network" value={formData.network} onChange={handleChange}>
                                            <option value="TRC-20">TRC-20</option>
                                            <option value="ERC-20">ERC-20</option>
                                            <option value="Bitcoin">Bitcoin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Amount Sent</label>
                                    <input 
                                        className="input-field" 
                                        type="number" 
                                        name="amount" 
                                        value={formData.amount} 
                                        onChange={handleChange} 
                                        placeholder="0.00" 
                                        required 
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Transaction Hash (TxID)</label>
                                    <input 
                                        className="input-field" 
                                        type="text" 
                                        name="txHash" 
                                        value={formData.txHash} 
                                        onChange={handleChange} 
                                        placeholder="Paste transaction ID here" 
                                        required 
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Your Wallet Address (From)</label>
                                    <input 
                                        className="input-field" 
                                        type="text" 
                                        name="fromAddress" 
                                        value={formData.fromAddress} 
                                        onChange={handleChange} 
                                        placeholder="Your sender address" 
                                        required 
                                    />
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Deposit Notification'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h3>Deposit History</h3>
                    </div>
                    <div className="dash-card-body">
                        {loading ? (
                            <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>Loading history...</p>
                        ) : deposits.length === 0 ? (
                            <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>No deposits found.</p>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Asset</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deposits.map((d) => (
                                            <tr key={d._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{d.assetType}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{d.network}</div>
                                                </td>
                                                <td>{d.amount}</td>
                                                <td>
                                                    <span className={`badge badge-${d.status}`}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
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

export default Deposits;
