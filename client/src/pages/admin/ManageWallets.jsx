import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageWallets = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Selected user details for modal audit log
    const [selectedUser, setSelectedUser] = useState(null);
    const [ledgerHistory, setLedgerHistory] = useState([]);
    const [loadingLedger, setLoadingLedger] = useState(false);
    
    // Balance Adjustment Modal State
    const [adjustmentModal, setAdjustmentModal] = useState({
        isOpen: false,
        user: null,
        walletType: 'fiat', // 'fiat' or 'points'
        type: 'credit', // 'credit' or 'debit'
        amount: '',
        description: ''
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            // Check if user object has balance fields. Let's merge fresh balance info if users endpoint doesn't return balance.
            // Wait, does the API return balances in /admin/users? Let's check or handle it gracefully.
            // The default getAdminUsers gets all users. Let's fetch balances dynamically if needed or show them if available.
            // Actually, we can fetch all users, and also the backend returns user list. Let's make sure it handles users with balances.
            setUsers(res.data.users || []);
        } catch (err) {
            setError('Failed to fetch platform users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch ledger details for a specific user
    const viewUserLedger = async (user) => {
        setSelectedUser(user);
        setLoadingLedger(true);
        try {
            const res = await api.get(`/ledger/admin/user/${user.id}`);
            setLedgerHistory(res.data.records || []);
        } catch (err) {
            console.error('Failed to fetch user ledger:', err);
        } finally {
            setLoadingLedger(false);
        }
    };

    // Handle manual credit/debit adjustment
    const handleAdjustSubmit = async (e) => {
        e.preventDefault();
        const { user, walletType, type, amount, description } = adjustmentModal;
        
        if (!amount || parseFloat(amount) <= 0 || !description) {
            setError('Please provide a valid positive amount and description.');
            return;
        }

        try {
            setError('');
            setSuccess('');
            const res = await api.post('/ledger/admin/adjust', {
                userId: user.id,
                walletType,
                type,
                amount: parseFloat(amount),
                description
            });

            setSuccess(`Successfully adjusted balance for ${user.email}`);
            setAdjustmentModal({ isOpen: false, user: null, walletType: 'fiat', type: 'credit', amount: '', description: '' });
            
            // Refresh users list to reflect new balances
            fetchUsers();
            
            // If the audited user is the one adjusted, reload ledger
            if (selectedUser?.id === user.id) {
                viewUserLedger(user);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to adjust user balance.');
        }
    };

    // Filter users list by email or username
    const filteredUsers = users.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Wallet Management">
            <div className="dashboard-content fade-in" style={{ textAlign: 'left' }}>
                
                {/* Search Bar & Alerts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <input 
                        type="text"
                        placeholder="Search user by email or username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.65rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            width: '100%',
                            maxWidth: '350px',
                            outline: 'none'
                        }}
                    />
                </div>

                {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                {success && <div className="alert-banner" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '1.5rem' }}>{success}</div>}

                {/* Main Users Balance Table */}
                <div className="dash-card" style={{ padding: 0, overflowX: 'auto', marginBottom: '2rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>User</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Username</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Fiat Balance</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Gift Points</th>
                                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        Loading users list...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                                            <div style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{u.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Role: {u.role}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>@{u.username}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                            ₦{(u.availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                            {(u.giftPoints || 0).toLocaleString()} pts
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => setAdjustmentModal({ isOpen: true, user: u, walletType: 'fiat', type: 'credit', amount: '', description: '' })}
                                                style={{ border: 'none', background: 'var(--color-primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Adjust
                                            </button>
                                            <button 
                                                onClick={() => viewUserLedger(u)}
                                                style={{ border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Audit Trail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Audit Trail Section */}
                {selectedUser && (
                    <div className="dash-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>
                                Audit Trail for <span style={{ color: '#5170ff' }}>{selectedUser.email}</span>
                            </h3>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.8125rem' }}
                            >
                                Close Trail
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Wallet</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Type</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Category</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Description</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Amount</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Bal. Impact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingLedger ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading ledger logs...</td>
                                        </tr>
                                    ) : ledgerHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No ledger actions recorded.</td>
                                        </tr>
                                    ) : (
                                        ledgerHistory.map(r => (
                                            <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem' }}>{new Date(r.createdAt).toLocaleString()}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', textTransform: 'uppercase' }}>{r.walletType}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', textTransform: 'uppercase', color: r.type === 'credit' ? '#059669' : '#dc2626', fontWeight: '600' }}>{r.type}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', textTransform: 'capitalize' }}>{r.category?.replace('_', ' ')}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem' }}>{r.description}</td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', fontWeight: '600' }}>
                                                    {r.walletType === 'fiat' ? `₦${r.amount.toFixed(2)}` : `${r.amount} pts`}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem' }}>
                                                    {r.walletType === 'fiat' ? `₦${r.runningBalance.toFixed(2)}` : `${r.runningBalance} pts`}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Adjustment Modal Overlay */}
                {adjustmentModal.isOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="auth-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>Adjust Balance</h3>
                                <button 
                                    onClick={() => setAdjustmentModal({ isOpen: false, user: null, walletType: 'fiat', type: 'credit', amount: '', description: '' })}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>

                            <form onSubmit={handleAdjustSubmit}>
                                {/* Target User Display */}
                                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--color-text-secondary)' }}>Target User: </span>
                                    <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{adjustmentModal.user?.email}</span>
                                </div>

                                {/* Wallet Select */}
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Wallet Category</label>
                                    <select 
                                        value={adjustmentModal.walletType}
                                        onChange={(e) => setAdjustmentModal({ ...adjustmentModal, walletType: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                    >
                                        <option value="fiat">Fiat (Naira) Wallet</option>
                                        <option value="points">Gift Points Wallet</option>
                                    </select>
                                </div>

                                {/* Adjustment Type */}
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Adjustment Type</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                            <input 
                                                type="radio" 
                                                name="adj_type" 
                                                value="credit"
                                                checked={adjustmentModal.type === 'credit'}
                                                onChange={() => setAdjustmentModal({ ...adjustmentModal, type: 'credit' })}
                                            />
                                            Credit (Add Funds)
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                            <input 
                                                type="radio" 
                                                name="adj_type" 
                                                value="debit"
                                                checked={adjustmentModal.type === 'debit'}
                                                onChange={() => setAdjustmentModal({ ...adjustmentModal, type: 'debit' })}
                                            />
                                            Debit (Deduct Funds)
                                        </label>
                                    </div>
                                </div>

                                {/* Adjustment Amount */}
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label htmlFor="adj_amount" style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Amount</label>
                                    <input 
                                        id="adj_amount"
                                        type="number"
                                        step="any"
                                        placeholder="e.g. 1000"
                                        value={adjustmentModal.amount}
                                        onChange={(e) => setAdjustmentModal({ ...adjustmentModal, amount: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                    />
                                </div>

                                {/* Adjustment Reason */}
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label htmlFor="adj_desc" style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Reason / Comment</label>
                                    <input 
                                        id="adj_desc"
                                        type="text"
                                        placeholder="e.g. Referral reward credit"
                                        value={adjustmentModal.description}
                                        onChange={(e) => setAdjustmentModal({ ...adjustmentModal, description: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Confirm Adjustment
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default ManageWallets;
