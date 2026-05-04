import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

const Topbar = ({ onMenuClick, title, headerContent }) => {
    const { user } = useAuth();

    return (
        <header className="topbar" style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '1rem 1.5rem',
            background: '#f9fafb',
            border: 'none',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                <button className="mobile-menu-btn" onClick={onMenuClick} style={{ flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                {headerContent}
                {title && <h2 className="topbar-title" style={{ margin: 0, fontSize: '16px', fontWeight: '400', color: '#1e293b' }}>{title}</h2>}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <NotificationDropdown />
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
