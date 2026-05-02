import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('settings')) return 'Settings';
        if (path.includes('kyc')) return 'KYC Verification';
        if (path.includes('crypto-actions')) return 'Crypto Actions';
        if (path.includes('withdraw')) return 'Withdraw';
        if (path.includes('convert')) return 'Convert';
        if (path.includes('referral')) return 'Referrals';
        if (path.includes('products')) return 'Products';
        if (path.includes('transactions')) return 'Transactions';
        if (path === '/dashboard') return 'Dashboard';
        return 'Cradera';
    };

    return (
        <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                <h1 className="mobile-page-title" style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>
                    {getPageTitle()}
                </h1>
            </div>
            <div className="topbar-user" style={{ cursor: 'pointer' }} onClick={() => window.location.href='/dashboard/settings?tab=profile'}>
                <span className="user-email">{user?.email}</span>
                <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: '#5170ff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                }}>
                    {user?.username?.charAt(0) || user?.email?.charAt(0)}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
