import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('payment');
    const [paymentAccounts, setPaymentAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Payment Account states
    const [accountType, setAccountType] = useState('bank');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('TRC20');

    // Profile states
    const [profileForm, setProfileForm] = useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || ''
    });

    // Security states
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (activeTab === 'payment') {
            fetchPaymentAccounts();
        }
        // Update profile form when user object changes
        if (user) {
            setProfileForm({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                email: user.email || ''
            });
        }
    }, [activeTab, user]);

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
            setAccountName(''); setBankName(''); setAccountNumber(''); setWalletAddress('');
        } catch (err) {
            alert(err.response?.data?.error || 'Error adding account');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/settings/profile', profileForm);
            alert('Profile updated successfully');
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating profile');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return alert('Passwords do not match');
        }
        try {
            await api.patch('/settings/security', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            alert('Password updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating password');
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
                            <label>Account Label</label>
                            <input type="text" className="form-input" value={accountName} onChange={(e) => setAccountName(e.target.value)} required placeholder="Main Bank" />
                        </div>

                        {accountType === 'bank' ? (
                            <>
                                <div className="form-group">
                                    <label>Bank Name</label>
                                    <input type="text" className="form-input" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Account Number</label>
                                    <input type="text" className="form-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Network</label>
                                    <select className="form-input" value={network} onChange={(e) => setNetwork(e.target.value)}>
                                        <option value="TRC20">TRC20</option>
                                        <option value="ERC20">ERC20</option>
                                        <option value="BEP20">BEP20</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Wallet Address</label>
                                    <input type="text" className="form-input" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required />
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#5170ff' }}>Add Account</button>
                    </form>
                </div>

                <div className="dash-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Your Saved Accounts</h3>
                    {loading ? <div className="loading-spinner"></div> : paymentAccounts.length === 0 ? <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem' }}>No accounts added yet.</p> : (
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
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{acc.type === 'bank' ? `${acc.bankName} • ${acc.accountNumber}` : `${acc.network} • ${acc.cryptoWalletAddress.substring(0, 10)}...`}</p>
                                    </div>
                                    {!acc.isDefault ? <button onClick={() => handleSetDefault(acc._id)} style={{ fontSize: '0.7rem', background: 'none', border: '1px solid #ddd', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}>Set Default</button> : <span style={{ fontSize: '0.7rem', color: '#5170ff', fontWeight: '600' }}>DEFAULT</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderProfileSettings = () => (
        <div className="dash-card fade-in" style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Profile Information</h3>
            <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="form-input" value={profileForm.fullName} onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" className="form-input" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" className="form-input" value={profileForm.phoneNumber} onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ background: '#5170ff', marginTop: '1rem' }}>Save Changes</button>
            </form>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="dash-card fade-in" style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Security Settings</h3>
            <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-input" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-input" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="form-input" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ background: '#5170ff', marginTop: '1rem' }}>Update Password</button>
            </form>
        </div>
    );

    const renderKYCSettings = () => (
        <div className="dash-card fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ marginBottom: '1.5rem', color: '#5170ff' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>KYC Verification</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Your current verification status:</p>
            <span style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', background: user?.kycStatus === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: user?.kycStatus === 'verified' ? '#10B981' : '#F59E0B', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase' }}>{user?.kycStatus || 'UNVERIFIED'}</span>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Settings</h1>
                    <p className="dashboard-subtitle">Manage your account preferences and security.</p>
                </div>
                <div className="dash-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
                        {['payment', 'profile', 'security', 'kyc'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '1.25rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #5170ff' : 'none', color: activeTab === tab ? '#5170ff' : 'var(--color-text-secondary)', fontWeight: activeTab === tab ? '600' : '500', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{tab} Settings</button>
                        ))}
                    </div>
                </div>
                {activeTab === 'payment' && renderPaymentSettings()}
                {activeTab === 'profile' && renderProfileSettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                {activeTab === 'kyc' && renderKYCSettings()}
            </div>
        </DashboardLayout>
    );
};

export default Settings;
