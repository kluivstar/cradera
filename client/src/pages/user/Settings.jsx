import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [paymentAccounts, setPaymentAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Edit modes
    const [editMode, setEditMode] = useState(null); // 'name', 'phone', 'country'

    // Form states
    const [profileForm, setProfileForm] = useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        country: user?.country || '',
        email: user?.email || ''
    });

    // Modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pins, setPins] = useState({ currentPin: '', newPin: '', confirmPin: '' });

    // Payment states (maintained from before)
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
        if (user) {
            setProfileForm({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                country: user.country || '',
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

    const handleUpdateProfile = async (field) => {
        try {
            await api.patch('/settings/profile', { [field]: profileForm[field] });
            alert(`${field} updated successfully`);
            setEditMode(null);
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating profile');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) return alert('Passwords do not match');
        try {
            await api.patch('/settings/security', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            alert('Password updated successfully');
            setShowPasswordModal(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating password');
        }
    };

    const handleUpdatePin = async (e) => {
        e.preventDefault();
        if (pins.newPin !== pins.confirmPin) return alert('PINs do not match');
        try {
            await api.patch('/settings/pin', {
                currentPin: pins.currentPin,
                newPin: pins.newPin
            });
            alert('Transaction PIN updated successfully');
            setShowPinModal(false);
            setPins({ currentPin: '', newPin: '', confirmPin: '' });
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating PIN');
        }
    };

    // Modal Component
    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                <div className="dash-card fade-in" style={{ width: '90%', maxWidth: '450px', padding: '2rem', position: 'relative' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
                    </button>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>{title}</h3>
                    {children}
                </div>
            </div>
        );
    };

    const renderProfileTab = () => (
        <div className="fade-in">
            <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
                <div className="dash-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Personal Information</h3>
                    
                    {/* Unique ID - Read Only */}
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#F9FAFB', borderRadius: '12px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Unique ID</label>
                        <p style={{ fontWeight: '600', color: 'var(--color-primary)', marginTop: '0.25rem' }}>{user?.uniqueId || 'Generating...'}</p>
                    </div>

                    {/* Email - Read Only */}
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #F3F4F6', borderRadius: '12px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#6B7280' }}>Email Address</label>
                        <p style={{ fontWeight: '500', color: '#374151', marginTop: '0.25rem' }}>{user?.email}</p>
                    </div>

                    {/* Full Name - Edit via Icon */}
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #F3F4F6', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', color: '#6B7280' }}>Full Name</label>
                                {editMode === 'fullName' ? (
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ marginTop: '0.5rem' }}
                                        value={profileForm.fullName} 
                                        onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                                        autoFocus
                                    />
                                ) : (
                                    <p style={{ fontWeight: '500', color: '#374151', marginTop: '0.25rem' }}>{user?.fullName || 'Not Set'}</p>
                                )}
                            </div>
                            <button 
                                onClick={() => editMode === 'fullName' ? handleUpdateProfile('fullName') : setEditMode('fullName')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5170ff', padding: '0.5rem' }}
                            >
                                {editMode === 'fullName' ? (
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>SAVE</span>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Phone - Editable */}
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #F3F4F6', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', color: '#6B7280' }}>Phone Number</label>
                                {editMode === 'phoneNumber' ? (
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ marginTop: '0.5rem' }}
                                        value={profileForm.phoneNumber} 
                                        onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                                        autoFocus
                                    />
                                ) : (
                                    <p style={{ fontWeight: '500', color: '#374151', marginTop: '0.25rem' }}>{user?.phoneNumber || 'Not Set'}</p>
                                )}
                            </div>
                            <button 
                                onClick={() => editMode === 'phoneNumber' ? handleUpdateProfile('phoneNumber') : setEditMode('phoneNumber')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5170ff', padding: '0.5rem' }}
                            >
                                {editMode === 'phoneNumber' ? (
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>SAVE</span>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Country - Editable */}
                    <div style={{ padding: '1rem', border: '1px solid #F3F4F6', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.75rem', color: '#6B7280' }}>Country</label>
                                {editMode === 'country' ? (
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ marginTop: '0.5rem' }}
                                        value={profileForm.country} 
                                        onChange={(e) => setProfileForm({...profileForm, country: e.target.value})}
                                        autoFocus
                                    />
                                ) : (
                                    <p style={{ fontWeight: '500', color: '#374151', marginTop: '0.25rem' }}>{user?.country || 'Not Set'}</p>
                                )}
                            </div>
                            <button 
                                onClick={() => editMode === 'country' ? handleUpdateProfile('country') : setEditMode('country')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5170ff', padding: '0.5rem' }}
                            >
                                {editMode === 'country' ? (
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>SAVE</span>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* KYC Section Integrated Under Profile */}
                <div className="dash-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '500' }}>Identity Verification</h3>
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ 
                            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(81, 112, 255, 0.1)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto',
                            color: '#5170ff'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Verification Status</p>
                        <span style={{ 
                            padding: '0.5rem 1.5rem', borderRadius: '50px', 
                            background: user?.kycStatus === 'verified' ? '#D1FAE5' : '#FEF3C7',
                            color: user?.kycStatus === 'verified' ? '#065F46' : '#92400E',
                            fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase'
                        }}>
                            {user?.kycStatus || 'UNVERIFIED'}
                        </span>
                        <div style={{ marginTop: '2rem' }}>
                            {user?.kycStatus === 'unverified' && (
                                <button className="btn btn-primary" style={{ width: '100%', background: '#5170ff' }}>Complete Verification</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="fade-in">
            <div className="dash-card" style={{ maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', fontWeight: '500' }}>Security Settings</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid #F3F4F6', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Login Password</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Update your password regularly to keep your account safe.</p>
                        </div>
                        <button 
                            onClick={() => setShowPasswordModal(true)}
                            className="btn btn-secondary" 
                            style={{ padding: '0.6rem 1.2rem', color: '#5170ff', border: '1px solid #5170ff', background: 'none' }}
                        >
                            Change Password
                        </button>
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid #F3F4F6', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Transaction PIN</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Required for authorizing withdrawals and transfers.</p>
                        </div>
                        <button 
                            onClick={() => setShowPinModal(true)}
                            className="btn btn-secondary" 
                            style={{ padding: '0.6rem 1.2rem', color: '#5170ff', border: '1px solid #5170ff', background: 'none' }}
                        >
                            {user?.transactionPin ? 'Change PIN' : 'Set PIN'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
                <form onSubmit={handleUpdatePassword}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" placeholder="••••••••" className="form-input" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" placeholder="••••••••" className="form-input" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="form-input" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#5170ff', marginTop: '1rem' }}>Update Password</button>
                </form>
            </Modal>

            {/* PIN Modal */}
            <Modal isOpen={showPinModal} onClose={() => setShowPinModal(false)} title={user?.transactionPin ? "Change PIN" : "Set Transaction PIN"}>
                <form onSubmit={handleUpdatePin}>
                    {user?.transactionPin && (
                        <div className="form-group">
                            <label>Current PIN</label>
                            <input type="password" maxLength="6" placeholder="••••••" className="form-input" value={pins.currentPin} onChange={(e) => setPins({...pins, currentPin: e.target.value})} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>New PIN (4-6 digits)</label>
                        <input type="password" maxLength="6" placeholder="••••••" className="form-input" value={pins.newPin} onChange={(e) => setPins({...pins, newPin: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm New PIN</label>
                        <input type="password" maxLength="6" placeholder="••••••" className="form-input" value={pins.confirmPin} onChange={(e) => setPins({...pins, confirmPin: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', background: '#5170ff', marginTop: '1rem' }}>Save PIN</button>
                </form>
            </Modal>
        </div>
    );

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

    const handleSetDefault = async (id) => {
        try {
            await api.patch(`/payment-accounts/${id}`, { isDefault: true });
            fetchPaymentAccounts();
        } catch (err) {
            alert('Error updating default account');
        }
    };
    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Settings</h1>
                    <p className="dashboard-subtitle">Manage your account identity and security.</p>
                </div>
                <div className="dash-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
                        {['profile', 'security', 'payment'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '1.25rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #5170ff' : 'none', color: activeTab === tab ? '#5170ff' : 'var(--color-text-secondary)', fontWeight: activeTab === tab ? '600' : '500', cursor: 'pointer', textTransform: 'capitalize', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{tab} Settings</button>
                        ))}
                    </div>
                </div>
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'payment' && renderPaymentSettings()}
            </div>
        </DashboardLayout>
    );
};

export default Settings;
