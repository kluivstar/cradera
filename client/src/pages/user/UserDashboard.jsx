import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const UserDashboard = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const displayName = user?.email?.split('@')[0];

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

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>
                            Welcome back, <span style={{ color: 'var(--color-accent)' }}>{displayName}</span>
                        </h1>
                        <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Monitor your assets and manage your trades with ease.</p>
                    </div>
                    {user?.kycStatus !== 'verified' && (
                        <Link to="/dashboard/kyc" style={{ 
                            background: 'rgba(56, 189, 248, 0.05)', 
                            color: 'var(--color-primary)', 
                            padding: '0.6rem 1.2rem', 
                            borderRadius: '10px', 
                            fontSize: '0.85rem', 
                            fontWeight: '500',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                            Complete KYC
                        </Link>
                    )}
                </div>

                <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                    
                    {/* Main Balance Card (8 cols) */}
                    <div style={{ gridColumn: 'span 8' }}>
                        <div className="dash-card" style={{ 
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
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>Available Balance</p>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '500', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>₦0.00</h2>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Link to="/dashboard/deposits" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontWeight: '500', borderRadius: '10px', textDecoration: 'none' }}>
                                        + Deposit
                                    </Link>
                                    <button className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', fontWeight: '500', borderRadius: '10px' }}>
                                        - Withdrawal
                                    </button>
                                    <Link to="/dashboard/convert" className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', fontWeight: '500', borderRadius: '10px', textDecoration: 'none' }}>
                                        Convert
                                    </Link>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', top: '-5%', right: '-2%', fontSize: '8rem', opacity: 0.03, transform: 'rotate(-15deg)', color: 'var(--color-primary)' }}>C</div>
                        </div>
                    </div>

                    {/* Quick Stats (4 cols) */}
                    <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="dash-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.1rem' }}>Referral Earnings</p>
                                <p style={{ fontWeight: '500', color: 'var(--color-primary)', fontSize: '1rem' }}>₦0.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Row (Full Width) */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: 'var(--color-primary)' }}>Our Services</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            <Link to="/dashboard/products" className="dash-card service-hover" style={{ textDecoration: 'none', textAlign: 'center', padding: '1.5rem 1rem' }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '10px', background: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    marginBottom: '0.75rem', margin: '0 auto 0.75rem auto',
                                    color: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Buy/Sell Crypto</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Instant settlement in Naira</p>
                            </Link>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '1.5rem 1rem', opacity: 0.7 }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '10px', background: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    marginBottom: '0.75rem', margin: '0 auto 0.75rem auto',
                                    color: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Gift Cards</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Coming soon</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '1.5rem 1rem', opacity: 0.7 }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '10px', background: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    marginBottom: '0.75rem', margin: '0 auto 0.75rem auto',
                                    color: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Bill Payments</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Airtime, Data & Power</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '1.5rem 1rem', opacity: 0.7 }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '10px', background: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    marginBottom: '0.75rem', margin: '0 auto 0.75rem auto',
                                    color: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Vault</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Save in USD & Earn</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions (Full Width) */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)' }}>Recent Activity</h3>
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
            </div>
            <style>{`
                .service-hover { transition: all 0.3s ease; }
                .service-hover:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(56, 189, 248, 0.1); }
            `}</style>
        </DashboardLayout>
    );
};

export default UserDashboard;
