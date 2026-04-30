import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [paymentAccounts, setPaymentAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Payment Account states
    const [accountType, setAccountType] = useState('bank');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('TRC20');

    // Profile states
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

    // Security states
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (activeTab === 'payment') {
            fetchPaymentAccounts();
        }
        if (user) {
            setPhoneNumber(user.phoneNumber || '');
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

    const handleUpdatePhone = async () => {
        try {
            await api.patch('/settings/profile', { phoneNumber });
            alert('Phone number updated');
            setIsEditingPhone(false);
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating phone');
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
            setShowPasswordModal(false);
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

    // Style constants for reuse
    const containerStyle = { fontWeight: '500' };
    const headingStyle = { fontWeight: '500', margin: 0 };
    const cardStyle = { padding: '2rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: 'white', borderRadius: '16px' };
    const inputStyle = { border: 'none', background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', width: '100%', outline: 'none', fontWeight: '500' };

    const renderPaymentSettings = () => (
        <div className="fade-in">
            <div className="grid-2" style={{ gap: '2.5rem' }}>
                <div className="dash-card" style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                        <h3 style={headingStyle}>New Payout Method</h3>
                    </div>
                    
                    <form onSubmit={handleAddAccount}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.35rem', borderRadius: '12px' }}>
                                <button type="button" onClick={() => setAccountType('bank')} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none', background: accountType === 'bank' ? 'white' : 'transparent', color: accountType === 'bank' ? '#5170ff' : '#64748b', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', boxShadow: accountType === 'bank' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>Bank</button>
                                <button type="button" onClick={() => setAccountType('crypto')} style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none', background: accountType === 'crypto' ? 'white' : 'transparent', color: accountType === 'crypto' ? '#5170ff' : '#64748b', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', boxShadow: accountType === 'crypto' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>Crypto</button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>ACCOUNT LABEL</label>
                            <input type="text" style={inputStyle} value={accountName} onChange={(e) => setAccountName(e.target.value)} required placeholder="e.g. My Savings" />
                        </div>

                        {accountType === 'bank' ? (
                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>BANK NAME</label>
                                    <input type="text" style={inputStyle} value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>ACCOUNT NUMBER</label>
                                    <input type="text" style={inputStyle} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>NETWORK</label>
                                    <select style={inputStyle} value={network} onChange={(e) => setNetwork(e.target.value)}>
                                        <option value="TRC20">Tether (TRC20)</option>
                                        <option value="ERC20">Tether (ERC20)</option>
                                        <option value="SOL">Solana</option>
                                        <option value="BTC">Bitcoin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>WALLET ADDRESS</label>
                                    <input type="text" style={inputStyle} value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required />
                                </div>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', background: '#5170ff', padding: '1rem', borderRadius: '12px', fontWeight: '500', border: 'none', color: 'white', cursor: 'pointer' }}>Save Account</button>
                    </form>
                </div>

                <div className="dash-card" style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={headingStyle}>Saved Payouts</h3>
                        <div style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontWeight: '500' }}>
                            {paymentAccounts.length} Methods
                        </div>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', display: 'grid', gap: '1rem' }}>
                        {loading ? <div className="loading-spinner"></div> : paymentAccounts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No payout methods saved.</p>
                            </div>
                        ) : (
                            paymentAccounts.map(acc => (
                                <div key={acc._id} style={{ 
                                    padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: '#f8fafc', borderRadius: '14px', border: 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5170ff', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                            {acc.type === 'bank' ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 10V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M8 21v-7M12 21v-7M16 21v-7"/></svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <p style={{ fontWeight: '500', fontSize: '0.95rem', margin: 0 }}>{acc.accountName}</p>
                                                {acc.isDefault && <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', background: '#5170ff', color: 'white', borderRadius: '4px' }}>DEF</span>}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
                                                {acc.type === 'bank' ? acc.bankName : acc.network}
                                            </p>
                                        </div>
                                    </div>
                                    {!acc.isDefault && (
                                        <button onClick={() => handleSetDefault(acc._id)} style={{ fontSize: '0.75rem', color: '#5170ff', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>Set Default</button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfileSettings = () => {
        const isUnverified = user?.kycStatus === 'unverified';

        return (
            <div className="fade-in">
                <div className="grid-2" style={{ gap: '2.5rem' }}>
                    <div className="dash-card" style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={headingStyle}>Personal Information</h3>
                            <div style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontWeight: '500' }}>
                                ID: {user?.uniqueId || '------'}
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>USERNAME</p>
                                    <p style={{ fontWeight: '500', margin: 0 }}>@{user?.username || 'Not set'}</p>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic', alignSelf: 'center' }}>Immutable</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>EMAIL ADDRESS</p>
                                    <p style={{ fontWeight: '500', color: '#94a3b8', margin: 0 }}>{user?.email}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>PHONE NUMBER</p>
                                    {isEditingPhone ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <input type="text" style={{ ...inputStyle, padding: '0.5rem' }} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                            <button onClick={handleUpdatePhone} className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#5170ff', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Save</button>
                                            <button onClick={() => setIsEditingPhone(false)} style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <p style={{ fontWeight: '500', margin: 0 }}>{user?.phoneNumber || 'Not set'}</p>
                                    )}
                                </div>
                                {!isEditingPhone && (
                                    <button onClick={() => setIsEditingPhone(true)} style={{ background: 'none', border: 'none', color: '#5170ff', cursor: 'pointer', alignSelf: 'center' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }}>COUNTRY</p>
                                    <p style={{ fontWeight: '500', margin: 0 }}>{user?.country || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dash-card" style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: user?.kycStatus === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: user?.kycStatus === 'verified' ? '#10B981' : '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <h3 style={{ ...headingStyle, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Account Status</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '240px', fontWeight: '500' }}>
                            {isUnverified ? "Your account is currently unverified. Complete KYC to lift limits." : "Your account is verified and fully operational."}
                        </p>
                        
                        {isUnverified ? (
                            <Link to="/dashboard/kyc" style={{ background: '#5170ff', padding: '0.8rem 2rem', borderRadius: '50px', textDecoration: 'none', color: 'white', fontWeight: '500' }}>
                                Complete KYC Now
                            </Link>
                        ) : (
                            <div style={{ padding: '0.6rem 2rem', borderRadius: '50px', background: '#10B981', color: 'white', fontWeight: '500', fontSize: '0.85rem' }}>
                                VERIFIED
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderSecuritySettings = () => (
        <div className="dash-card fade-in" style={{ ...cardStyle, maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(81, 112, 255, 0.1)', color: '#5170ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                    <h3 style={headingStyle}>Security & Access</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>Keep your account protected and up to date.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontWeight: '500', marginBottom: '0.25rem', margin: 0 }}>Account Password</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Last changed: Just now</p>
                    </div>
                    <button onClick={() => setShowPasswordModal(true)} style={{ background: '#5170ff', borderRadius: '10px', color: 'white', border: 'none', padding: '0.6rem 1.25rem', cursor: 'pointer', fontWeight: '500' }}>Change Password</button>
                </div>

                <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
                    <div>
                        <p style={{ fontWeight: '500', marginBottom: '0.25rem', margin: 0 }}>Two-Factor Authentication (2FA)</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Enhance security with a second step.</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#94a3b8' }}>SOON</span>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div style={{ ...cardStyle, width: '100%', maxWidth: '440px', position: 'relative', borderRadius: '20px' }}>
                        <button onClick={() => setShowPasswordModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
                        </button>
                        <h2 style={{ ...headingStyle, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Change Password</h2>
                        <form onSubmit={handleUpdatePassword}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>CURRENT PASSWORD</label>
                                <input type="password" style={inputStyle} value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>NEW PASSWORD</label>
                                <input type="password" style={inputStyle} value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '500' }}>CONFIRM NEW PASSWORD</label>
                                <input type="password" style={inputStyle} value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                            </div>
                            <button type="submit" style={{ width: '100%', background: '#5170ff', padding: '1rem', borderRadius: '12px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '500' }}>Update Securely</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={containerStyle}>
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ ...headingStyle, fontSize: '2rem', color: 'var(--color-primary)' }}>Account Settings</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', margin: 0 }}>Manage your personal data, payout methods and security.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {[
                        { id: 'profile', label: 'Profile & KYC', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                        { id: 'payment', label: 'Payout Methods', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
                        { id: 'security', label: 'Security', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            style={{ 
                                padding: '0.75rem 1.25rem', 
                                background: activeTab === tab.id ? 'white' : 'transparent', 
                                border: 'none', 
                                borderRadius: '10px',
                                color: activeTab === tab.id ? '#5170ff' : '#64748b', 
                                fontWeight: '500', 
                                cursor: 'pointer', 
                                fontSize: '0.9rem', 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'payment' && renderPaymentSettings()}
                {activeTab === 'profile' && renderProfileSettings()}
                {activeTab === 'security' && renderSecuritySettings()}
            </div>
        </DashboardLayout>
    );
};

export default Settings;
