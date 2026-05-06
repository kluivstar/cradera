import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

const Topbar = ({ onMenuClick, title, headerContent }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Only show back button if we are not on the main dashboard home
    const showBack = location.pathname !== '/dashboard' && location.pathname !== '/admin/dashboard';

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <button className="mobile-menu-btn" onClick={onMenuClick} style={{ flexShrink: 0 }}>
                    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {showBack && (
                        <button 
                            onClick={() => navigate(-1)} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--color-text-secondary)', 
                                cursor: 'pointer',
                                padding: '0.5rem 0'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                            </svg>
                        </button>
                    )}
                    {title && (
                        <h1 className="topbar-title" style={{ 
                            margin: 0, 
                            fontSize: '1.25rem', 
                            fontWeight: '400', 
                            color: 'var(--color-primary)',
                            whiteSpace: 'nowrap'
                        }}>
                            {title}
                        </h1>
                    )}
                </div>
                {headerContent}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <NotificationDropdown />
                    <div className="mobile-hide">
                        <UserDropdown />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
