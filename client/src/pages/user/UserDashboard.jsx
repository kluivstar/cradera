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
                <div className="dashboard-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                            Welcome back, <span style={{ color: 'var(--color-accent)' }}>{displayName}</span>
                        </h1>
                        <p className="dashboard-subtitle">Monitor your assets and manage your trades with ease.</p>
                    </div>
                    {user?.kycStatus !== 'verified' && (
                        <Link to="/dashboard/kyc" style={{ 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            color: '#D97706', 
                            padding: '0.6rem 1.2rem', 
                            borderRadius: '10px', 
                            fontSize: '0.85rem', 
                            fontWeight: '700',
                            textDecoration: 'none',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                            ⚠️ Verify Identity
                        </Link>
                    )}
                </div>

                <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                    
                    {/* Main Balance Card (8 cols) */}
                    <div style={{ gridColumn: 'span 8' }}>
                        <div className="dash-card" style={{ 
                            background: 'linear-gradient(135deg, #1E3A8A 0%, #38BDF8 100%)', 
                            color: 'white', 
                            padding: '3rem',
                            borderRadius: '24px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(30, 58, 138, 0.2)',
                            minHeight: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.75rem', fontWeight: '500' }}>Available Balance</p>
                                <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '2.5rem' }}>₦0.00</h2>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <Link to="/dashboard/deposits" className="btn" style={{ background: 'white', color: 'var(--color-primary)', padding: '0.875rem 2rem', fontWeight: '700', borderRadius: '14px' }}>
                                        Deposit Funds
                                    </Link>
                                    <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.875rem 2rem', fontWeight: '700', borderRadius: '14px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        Send Money
                                    </button>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '15rem', opacity: 0.05, transform: 'rotate(-15deg)' }}>C</div>
                        </div>
                    </div>

                    {/* Quick Stats (4 cols) */}
                    <div style={{ gridColumn: 'span 4', display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📈</div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>Portfolio Change</p>
                                <p style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.1rem' }}>+₦0.00 (0%)</p>
                            </div>
                        </div>
                        <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💎</div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>Referral Earnings</p>
                                <p style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.1rem' }}>₦0.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Row (Full Width) */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Our Services</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            <Link to="/dashboard/products" className="dash-card service-hover" style={{ textDecoration: 'none', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🪙</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Buy/Sell Crypto</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Instant settlement in Naira</p>
                            </Link>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', opacity: 0.7 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🎁</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Gift Cards</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Coming soon</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', opacity: 0.7 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>📱</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Bill Payments</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Airtime, Data & Power</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', opacity: 0.7 }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>🔒</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Vault</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Save in USD & Earn</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions (Full Width) */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>Recent Activity</h3>
                            <Link to="/dashboard/transactions" style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: '700', textDecoration: 'none' }}>View All Activity</Link>
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
                                                <tr key={tx.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                    <td style={{ padding: '1.25rem 1.5rem', width: '60px' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                                            {tx.type === 'deposit' ? '💰' : '💸'}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <p style={{ fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>{tx.type === 'deposit' ? 'Wallet Top-up' : tx.type}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleString()}</p>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <p style={{ fontWeight: '600' }}>{tx.asset}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{tx.details?.network}</p>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                        <p style={{ fontWeight: '800', color: 'var(--color-primary)' }}>₦{tx.amount.toLocaleString()}</p>
                                                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: tx.status === 'confirmed' ? 'var(--color-accent)' : '#F59E0B' }}>
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
                .service-hover:hover { transform: translateY(-8px); border-color: var(--color-accent); box-shadow: 0 12px 30px rgba(56, 189, 248, 0.1); }
            `}</style>
        </DashboardLayout>
    );
};

export default UserDashboard;
