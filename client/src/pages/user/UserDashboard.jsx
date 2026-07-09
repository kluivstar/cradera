import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const UserDashboard = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [currency, setCurrency] = useState('NGN');
    const displayName = user?.email?.split('@')[0];

    const exchangeRate = 1500;
    const balanceNGN = user?.availableBalance || 0;
    const balanceUSD = balanceNGN / exchangeRate;
    
    const displayBalance = currency === 'NGN' 
        ? `₦${balanceNGN.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
        : `$${balanceUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    const hiddenBalance = '******';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/transactions');
                setTransactions(res.data.slice(0, 3)); // Only top 3
            } catch (err) {
                console.error('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const headerContent = (
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 className="desktop-greeting" style={{ fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>
                    Hello, <span style={{ color: '#5170ff' }}>{displayName}</span> 👋
                </h1>
            </div>
        </div>
    );

    return (
        <DashboardLayout title="Dashboard" headerContent={headerContent}>
            <div className="dashboard-content fade-in">

                <div className="mobile-greeting" style={{ marginBottom: '1rem', display: 'none' }}>
                    <h2 style={{ fontWeight: '500', color: 'var(--color-primary)', margin: 0, fontSize: '1.5rem' }}>
                        Hello, <span style={{ color: '#5170ff' }}>{displayName}</span> 👋
                    </h2>
                </div>

                <div className="dashboard-grid">
                    
                    {/* Main Balance Card (8 cols) */}
                    <div className="grid-span-8">
                        <div className="dash-card balance-card" style={{ 
                            background: 'white', 
                            color: 'var(--color-primary)', 
                            padding: '1.5rem 2rem',
                            borderRadius: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.03)',
                            minHeight: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <p className="balance-label" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500', margin: 0 }}>Available Balance</p>
                                        <button onClick={() => setIsBalanceVisible(!isBalanceVisible)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0.2rem', borderRadius: '50%', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background='#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background='none'} title="Toggle Balance Visibility">
                                            {isBalanceVisible ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                            )}
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <select className="currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ padding: '0.35rem 1.75rem 0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '0.75rem', fontWeight: '600', outline: 'none', cursor: 'pointer', color: '#0f172a', appearance: 'none', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                            <option value="NGN">NGN</option>
                                            <option value="USD">USD</option>
                                        </select>
                                        <div style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <h2 className="balance-value" style={{ fontSize: '2.5rem', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                                    {isBalanceVisible ? displayBalance : hiddenBalance}
                                </h2>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <Link to="/dashboard/withdraw" className="btn btn-primary balance-action-btn" style={{ padding: '0.6rem 1.5rem', fontWeight: '500', borderRadius: '5px', textDecoration: 'none', color: 'white', background: '#5170FF', border: '1px solid #5170FF', flex: '1 1 auto', minWidth: '120px', textAlign: 'center' }}>
                                        - Withdrawal
                                    </Link>
                                    <Link to="/dashboard/convert" className="btn btn-secondary balance-action-btn" style={{ padding: '0.6rem 1.5rem', fontWeight: '500', borderRadius: '5px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto', minWidth: '120px', justifyContent: 'center' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 3L21 8L16 13"/><path d="M21 8H9C6.23858 8 4 10.2386 4 13V15"/><path d="M8 21L3 16L8 11"/><path d="M3 16H15C17.7614 16 20 13.7614 20 11V9"/>
                                        </svg>
                                        Convert
                                    </Link>
                                </div>
                            </div>
                            {/* Abstract Textures */}
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '200px', height: '200px', borderRadius: '50%', background: 'linear-gradient(135deg, #5170ff 0%, transparent 100%)', opacity: 0.04, filter: 'blur(40px)', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #5170ff 0%, transparent 100%)', opacity: 0.03, filter: 'blur(30px)', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', top: '10%', left: '40%', width: '100px', height: '100px', border: '2px solid #5170ff', borderRadius: '20%', opacity: 0.02, transform: 'rotate(45deg)', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', top: '-5%', right: '-2%', fontSize: '8rem', opacity: 0.03, transform: 'rotate(-15deg)', color: 'var(--color-primary)', fontWeight: '900', zIndex: 0 }}>C</div>
                        </div>
                    </div>

                    {/* KYC Button (4 cols on desktop) */}
                    {user?.kycStatus !== 'verified' && (
                        <div className="grid-span-4 kyc-container-desktop">
                            <Link to="/dashboard/kyc" className="btn btn-primary" style={{ 
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#5170ff'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                </svg>
                                Complete KYC
                            </Link>
                        </div>
                    )}

                </div>{/* end dashboard-grid */}

                {/* Quick Actions — full width row with square cards */}
                <div className='quick-action-container' style={{ marginTop: '1.5rem', width: '100%' }}>
                    <h3 className="quick-actions-title" style={{ fontSize: '1.1rem', fontWeight: '400', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: '100%' }}>
                        <Link to="/dashboard/crypto-actions" className="dash-card service-hover" style={{ 
                            textDecoration: 'none', textAlign: 'center', 
                            flex: '1 1 0', aspectRatio: '10/7',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '1.5rem', background: '#eff6ff', border: '1px solid #dbeafe'
                        }}>
                            <div className="quick-action-card-icon" style={{ 
                                width: '40px', height: '40px', borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                marginBottom: '0.75rem',
                                color: '#1e40af', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                </svg>
                            </div>
                            <h4 className="quick-action-card-title" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '0.2rem', fontWeight: '500' }}>Buy/Sell</h4>
                        </Link>
                        <Link to="/dashboard/withdraw" className="dash-card service-hover" style={{ 
                            textDecoration: 'none', textAlign: 'center',
                            flex: '1 1 0', aspectRatio: '10/7',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem', background: '#f0fdf4', border: '1px solid #dcfce7'
                        }}>
                            <div className="quick-action-card-icon" style={{ 
                                width: '40px', height: '40px', borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                marginBottom: '0.75rem',
                                color: '#166534', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1v22M5 15l7 7 7-7"/>
                                </svg>
                            </div>
                            <h4 className="quick-action-card-title" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '0.2rem', fontWeight: '500' }}>Withdraw</h4>
                        </Link>
                        <Link to="/dashboard/earn" className="dash-card service-hover" style={{ 
                            textDecoration: 'none', textAlign: 'center',
                            flex: '1 1 0', aspectRatio: '10/7',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem', background: '#faf5ff', border: '1px solid #e9d5ff'
                        }}>
                            <div className="quick-action-card-icon" style={{ 
                                width: '40px', height: '40px', borderRadius: '10px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                marginBottom: '0.75rem',
                                color: '#6b21a8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z"/>
                                </svg>
                            </div>
                            <h4 className="quick-action-card-title" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '0.2rem', fontWeight: '500' }}>Earn</h4>
                        </Link>
                        <div className="dash-card service-hover" style={{ 
                            textAlign: 'center', opacity: 0.6, position: 'relative',
                            flex: '1 1 0', aspectRatio: '10/7',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem', background: '#fefce8', border: '1px solid #fef08a'
                        }}>
                            <span style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', fontSize: '0.55rem', fontWeight: '600', padding: '0.15rem 0.35rem', borderRadius: '4px', color: '#854d0e', textTransform: 'uppercase' }}>Soon</span>
                            <div className="quick-action-card-icon" style={{ 
                                width: '40px', height: '40px', borderRadius: '10px', background: '#fef08a', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                marginBottom: '0.75rem',
                                color: '#854d0e', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                </svg>
                            </div>
                            <h4 className="quick-action-card-title" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '0.2rem', fontWeight: '500' }}>Bills</h4>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions — full width, outside grid */}
                <div style={{ marginTop: '1.5rem', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="recent-transactions-title" style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)' }}>Recent Transactions</h3>
                        <Link to="/dashboard/transactions" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '500', textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                        ) : transactions.length === 0 ? (
                            <div style={{ padding: '4rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-secondary)' }}>No recent activity to show.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper" style={{ border: 'none' }}>
                                <table className="data-table">
                                    <tbody>
                                        {transactions.map(tx => (
                                            <tr key={tx.id}>
                                                <td style={{ padding: '0.75rem 1rem', width: '50px' }}>
                                                    <div style={{ 
                                                        width: '32px', height: '32px', borderRadius: '8px', 
                                                        background: tx.status === 'confirmed' ? 'rgba(16, 185, 129, 0.08)' : 'white', 
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                                        color: 'var(--color-primary)', boxShadow: tx.status === 'confirmed' ? 'none' : '0 2px 6px rgba(0,0,0,0.04)'
                                                    }}>
                                                        {tx.status === 'confirmed' ? (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"/>
                                                            </svg>
                                                        ) : (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                {tx.type === 'deposit' ? (
                                                                    <path d="M12 5v14M5 12l7 7 7-7"/>
                                                                ) : (
                                                                    <path d="M12 19V5M5 12l7-7 7 7"/>
                                                                )}
                                                            </svg>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <p style={{ fontWeight: '500', color: 'var(--color-primary)', marginBottom: '0.1rem', fontSize: '0.875rem' }}>{tx.type === 'deposit' ? 'Wallet Top-up' : tx.type}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleString()}</p>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                    <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>{tx.asset}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{tx.details?.network}</p>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '500', color: 'var(--color-primary)', fontSize: '0.875rem' }}>₦{tx.amount.toLocaleString()}</p>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: '500', color: tx.status === 'confirmed' ? 'var(--color-accent)' : '#F59E0B' }}>
                                                        {tx.status.toUpperCase()}
                                                    </p>
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
            <style>{`
                .service-hover { transition: all 0.3s ease; }
                .service-hover:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(56, 189, 248, 0.1); }
                @media (max-width: 768px) {
                    .desktop-greeting { display: none !important; }
                    .mobile-greeting { display: block !important; }
                    .dashboard-grid { margin-top: -8px; }
                    .balance-label { font-size: 16px !important; }
                    .balance-value { font-size: 16px !important; }
                    .currency-select { font-size: 13px !important; }
                    .balance-action-btn { font-size: 15px !important; }
                    .recent-transactions-title, .quick-actions-title { font-size: 12px !important; }
                    .quick-action-card-title { font-size: 10px !important; }
                    .quick-action-card-icon svg { width: 10px !important; height: 10px !important; }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default UserDashboard;
