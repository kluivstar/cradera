import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const displayName = user?.email?.split('@')[0];

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '600', color: 'var(--color-primary)' }}>Hello, {displayName}</h1>
                    <p className="dashboard-subtitle">Here's what's happening with your account today.</p>
                </div>

                <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }}>
                    {/* Balance Card */}
                    <div className="dash-card" style={{ 
                        background: 'var(--color-primary)', 
                        color: 'white', 
                        padding: '2.5rem',
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Total Balance</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>₦0.00</h2>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <Link to="/dashboard/deposits" className="btn btn-accent" style={{ padding: '0.6rem 1.5rem' }}>
                                    Add Funds
                                </Link>
                                <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                                    Withdraw
                                </button>
                            </div>
                        </div>
                        {/* Decorative circle */}
                        <div style={{ 
                            position: 'absolute', 
                            top: '-50px', 
                            right: '-50px', 
                            width: '200px', 
                            height: '200px', 
                            borderRadius: '50%', 
                            background: 'rgba(255,255,255,0.05)' 
                        }}></div>
                    </div>

                    {/* Product Shortcuts */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Quick Services</h3>
                        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                            <Link to="/dashboard/products" className="dash-card" style={{ textDecoration: 'none', textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🪙</div>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Crypto</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Buy & Sell Assets</p>
                            </Link>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎁</div>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Gift Cards</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Coming Soon</p>
                            </div>
                            <div className="dash-card" style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
                                <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Airtime</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
