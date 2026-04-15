import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/dashboard/kyc', label: 'KYC Status', icon: '🛡️' },
        { to: '/dashboard/deposits', label: 'Deposits', icon: '💰' },
    ];

    const adminLinks = [
        { to: '/admin', label: 'Overview', icon: '📊' },
        { to: '/admin/users', label: 'Users', icon: '👥' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">Cradera</div>
                <div className="sidebar-role-badge">
                    {isAdmin ? 'Admin' : 'User'}
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-user-info">
                    <span className="sidebar-user-email">{user?.email}</span>
                </div>
                <button onClick={handleLogout} className="sidebar-logout-btn">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
