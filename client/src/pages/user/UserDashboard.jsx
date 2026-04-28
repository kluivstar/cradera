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
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ color: 'var(--color-primary)' }}>
                            Welcome back, <span style={{ color: 'var(--color-accent)' }}>{displayName}</span>
                        </h1>
                        <p className="dashboard-subtitle">Monitor your assets and manage your trades with ease.</p>
                    </div>
                    {user?.kycStatus !== 'verified' && (
                        <Link to="/dashboard/kyc" style={{ 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            color: '#D97706', 
                            padding: '0.4rem 0.8rem', 
                            borderRadius: 'var(--radius-sm)', 
                            fontSize: 'var(--font-size-xs)', 
                            fontWeight: '700',
                            textDecoration: 'none',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                        }}>
                            ⚠️ Verify Identity
                        </Link>
                    )}
                </div>

                <div style={{ display: 'grid', gap: 'var(--spacing-6)', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                    
                    {/* Main Balance Card (8 cols) */}
                    <div style={{ gridColumn: 'span 8' }}>
                        <div className="dash-card" style={{ 
                            background: 'linear-gradient(135deg, #1E3A8A 0%, #0EA5E9 100%)', 
                            color: 'white', 
                            padding: 'var(--spacing-8)',
                            borderRadius: 'var(--radius-lg)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 25px rgba(30, 58, 138, 0.12)',
                            minHeight: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: 'none'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9, marginBottom: 'var(--spacing-2)', fontWeight: '500' }}>Available Balance</p>
                                <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: '800', marginBottom: 'var(--spacing-6)', color: 'white' }}>₦0.00</h2>
                                <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                                    <Link to="/dashboard/deposits" className="btn" style={{ background: 'white', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
                                        Deposit Funds
                                    </Link>
                                    <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', fontSize: '10rem', opacity: 0.05, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>C</div>
                        </div>
                    </div>

                    {/* Quick Stats (4 cols) */}
                    <div style={{ gridColumn: 'span 4', display: 'grid', gridTemplateRows: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                        <div className="dash-card" style={{ padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>📈</div>
                            <div>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Portfolio Change</p>
                                <p style={{ fontWeight: '700', color: 'var(--color-accent)' }}>+₦0.00 (0%)</p>
                            </div>
                        </div>
                        <div className="dash-card" style={{ padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💎</div>
                            <div>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Referral Earnings</p>
                                <p style={{ fontWeight: '700', color: 'var(--color-primary)' }}>₦0.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Row (Full Width) */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-primary)' }}>Our Services</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)' }}>
                            <Link to="/dashboard/products" className="dash-card service-hover" style={{ textDecoration: 'none', textAlign: 'center', padding: 'var(--spacing-6)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🪙</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>Buy/Sell Crypto</h4>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Instant settlement in Naira</p>
                            </Link>
                            <div className="dash-card" style={{ textAlign: 'center', padding: 'var(--spacing-6)', opacity: 0.7 }}>
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🎁</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>Gift Cards</h4>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Coming soon</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: 'var(--spacing-6)', opacity: 0.7 }}>
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>📱</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>Bill Payments</h4>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Airtime, Data & Power</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: 'var(--spacing-6)', opacity: 0.7 }}>
                                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🔒</div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>Vault</h4>
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Save in USD & Earn</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions (Full Width) */}
                    <div style={{ gridColumn: 'span 12' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                            <h3 style={{ color: 'var(--color-primary)' }}>Recent Activity</h3>
                            <Link to="/dashboard/transactions" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', fontWeight: '700', textDecoration: 'none' }}>View All Activity</Link>
                        </div>
                        <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                            {loading ? (
                                <div style={{ padding: '2rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                            ) : transactions.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>No recent activity to show.</p>
                                </div>
                            ) : (
                                <div className="table-wrapper" style={{ border: 'none' }}>
                                    <table className="data-table">
                                        <tbody>
                                            {transactions.map(tx => (
                                                <tr key={tx.id}>
                                                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', width: '56px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                                                            {tx.type === 'deposit' ? '💰' : '💸'}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                                                        <p style={{ fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.1rem' }}>{tx.type === 'deposit' ? 'Wallet Top-up' : tx.type}</p>
                                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</p>
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                                                        <p style={{ fontWeight: '600' }}>{tx.asset}</p>
                                                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{tx.details?.network}</p>
                                                    </td>
                                                    <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'right' }}>
                                                        <p style={{ fontWeight: '700', color: 'var(--color-primary)' }}>₦{tx.amount.toLocaleString()}</p>
                                                        <span className={`status-badge status-${tx.status}`} style={{ fontSize: '10px' }}>
                                                            {tx.status}
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
            </div>
            <style>{`
                .service-hover { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
                .service-hover:hover { transform: translateY(-4px); border-color: var(--color-accent); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.08); }
            `}</style>
        </DashboardLayout>
    );
};

export default UserDashboard;
