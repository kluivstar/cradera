import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <button className="mobile-menu-btn" onClick={onMenuClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
            <div className="topbar-user">
                <span className="user-email">{user?.email}</span>
                <div className="user-avatar" style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--color-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '0.8rem'
                }}>
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
