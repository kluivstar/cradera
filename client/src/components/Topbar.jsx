import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const { user } = useAuth();

    return (
        <header className="topbar">
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
