import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="user-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
                className="topbar-user" 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '-5px' }} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="user-email" style={{ display: 'none', '@media (min-width: 1024px)': { display: 'block' } }}>{user?.username || user?.email}</span>
                <div className="user-avatar-mobile" style={{ 
                    width: '33px', 
                    height: '33px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #5170ff 0%, #3b5bdb 100%)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    boxShadow: '0 4px 10px rgba(81, 112, 255, 0.2)',
                    overflow: 'hidden'
                }}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()
                    )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>

            {isOpen && (
                <div className="dropdown-menu fade-in" style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '240px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                    padding: '0.5rem',
                    zIndex: 1000,
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #f5f5f5', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#1a1a1a' }}>{user?.fullName || user?.username}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{user?.email}</p>
                    </div>

                    <Link to="/dashboard/settings?tab=profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profile Settings
                    </Link>
                    <Link to="/dashboard/kyc" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Verification
                    </Link>
                    <Link to="/dashboard/security" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Security & Sessions
                    </Link>
                    <Link to="/dashboard/referral" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Referrals
                    </Link>

                    <div style={{ height: '1px', background: '#f5f5f5', margin: '0.5rem 0' }}></div>

                    <button className="dropdown-item logout-btn" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', color: '#ef4444' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                    </button>
                </div>
            )}

            <style>{`
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    color: #444;
                    font-size: 0.9rem;
                    text-decoration: none;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .dropdown-item:hover {
                    background: #f8fafc;
                    color: #5170ff;
                }
                .dropdown-item svg {
                    opacity: 0.7;
                }
                .logout-btn:hover {
                    background: #fff1f2 !important;
                    color: #ef4444 !important;
                }
            `}</style>
        </div>
    );
};

export default UserDropdown;
