import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ onMenuClick, title }) => {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <button className="mobile-menu-btn" onClick={onMenuClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
            {title && <h2 className="topbar-title">{title}</h2>}
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
