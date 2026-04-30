import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('payment');
    const [paymentAccounts, setPaymentAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form states for new payment account
    const [accountType, setAccountType] = useState('bank');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('TRC20');

    useEffect(() => {
        if (activeTab === 'payment') {
            fetchPaymentAccounts();
        }
    }, [activeTab]);

    const fetchPaymentAccounts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/payment-accounts');
            setPaymentAccounts(res.data.paymentAccounts);
        } catch (err) {
            console.error('Error fetching payment accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async (e) => {
        e.preventDefault();
        try {
            const data = {
                type: accountType,
                accountName,
                bankName: accountType === 'bank' ? bankName : undefined,
                accountNumber: accountType === 'bank' ? accountNumber : undefined,
                cryptoWalletAddress: accountType === 'crypto' ? walletAddress : undefined,
                network: accountType === 'crypto' ? network : undefined,
            };
            await api.post('/payment-accounts', data);
            alert('Payment account added successfully');
            fetchPaymentAccounts();
            // Reset form
            setAccountName('');
            setBankName('');
            setAccountNumber('');
            setWalletAddress('');
        } catch (err) {
            alert(err.response?.data?.error || 'Error adding account');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.patch(`/payment-accounts/${id}`, { isDefault: true });
            fetchPaymentAccounts();
        } catch (err) {
            alert('Error updating default account');
        }
    };

    const renderPaymentSettings = () => (
        <div className="fade-in">
            <div className="grid-2" style={{ gap: '2rem' }}>
                {/* Add New Account Form */}
                <div className="dash-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Add Payout Method</h3>
                    <form onSubmit={handleAddAccount}>
                        <div className="form-group">
                            <label>Account Type</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" checked={accountType === 'bank'} onChange={() => setAccountType('bank')} /> Bank Account
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" checked={accountType === 'crypto'} onChange={() => setAccountType('crypto')} /> Crypto Wallet
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Account Label (e.g. My Savings, Main Wallet)</label>
                            <input type="text" className="form-input" value={accountName} onChange={(e) => setAccountName(e.target.value)} required placeholder="Main Bank" />
                        </div>

                        {accountType === 'bank' ? (
                            <>
                                <div className="form-group">
                                    <label>Bank Name</label>
                                    <input type="text" className="form-input" value={bankName} onChange={(e) => setBankName(e.target.value)} required placeholder="Guaranty Trust Bank" />
                                </div>
                                <div className="form-group">
                                    <label>Account Number</label>
                                    <input type="text" className="form-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required placeholder="0123456789" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Network</label>
                                    <select className="form-input" value={network} onChange={(e) => setNetwork(e.target.value)}>
                                        <option value="TRC20">TRC20 (Tether)</option>
                                        <option value="ERC20">ERC20 (Ethereum)</option>
                                        <option value="BEP20">BEP20 (BSC)</option>
                                        <option value="SOL">Solana</option>
                                        <option value="BTC">Bitcoin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Wallet Address</label>
                                    <input type="text" className="form-input" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required placeholder="0x... or T..." />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#5170ff' }}>Add Account</button>
                    </form>
                </div>

                {/* Saved Accounts List */}
                <div className="dash-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Your Saved Accounts</h3>
                    {loading ? (
                        <div className="loading-spinner"></div>
                    ) : paymentAccounts.length === 0 ? (
                        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem' }}>No payout accounts added yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {paymentAccounts.map(acc => (
                                <div key={acc._id} style={{ 
                                    padding: '1rem', border: '1px solid #eee', borderRadius: '10px', 
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: acc.isDefault ? 'rgba(81, 112, 255, 0.03)' : 'transparent',
                                    borderColor: acc.isDefault ? '#5170ff' : '#eee'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{acc.accountName}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                            {acc.type === 'bank' ? `${acc.bankName} • ${acc.accountNumber}` : `${acc.network} • ${acc.cryptoWalletAddress.substring(0, 10)}...`}
                                        </p>
                                    </div>
                                    {!acc.isDefault ? (
                                        <button onClick={() => handleSetDefault(acc._id)} style={{ fontSize: '0.7rem', background: 'none', border: '1px solid #ddd', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Set Default</button>
                                    ) : (
                                        <span style={{ fontSize: '0.7rem', color: '#5170ff', fontWeight: '600' }}>DEFAULT</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Settings</h1>
                    <p className="dashboard-subtitle">Manage your account preferences and payment methods.</p>
                </div>

                <div className="dash-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                        {['payment', 'profile', 'security', 'kyc'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{ 
                                    padding: '1rem 2rem', 
                                    background: 'none', 
                                    border: 'none', 
                                    borderBottom: activeTab === tab ? '2px solid #5170ff' : 'none',
                                    color: activeTab === tab ? '#5170ff' : 'var(--color-text-secondary)',
                                    fontWeight: activeTab === tab ? '600' : '500',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {tab} Settings
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'payment' && renderPaymentSettings()}
                {activeTab !== 'payment' && (
                    <div className="dash-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <p style={{ color: 'var(--color-text-secondary)' }}>This section is coming soon.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Settings;
