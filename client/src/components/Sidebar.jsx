import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        const redirectPath = isAdmin ? '/admin/login' : '/login';
        logout();
        navigate(redirectPath);
    };

    const userLinks = [
        { to: '/dashboard', label: 'Home', icon: '⊞' },
        { to: '/dashboard/products', label: 'Products', icon: '📦' },
        { to: '/dashboard/transactions', label: 'Transactions', icon: '🧾' },
        { to: '/dashboard/deposits', label: 'Deposit', icon: '💰' },
        { to: '/dashboard/kyc', label: 'KYC', icon: '🛡️' },
        { to: '/dashboard/referral', label: 'Referral', icon: '🎁' },
        { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
        { to: '/dashboard/support', label: 'Help & Support', icon: '💬' },
    ];

    const adminLinks = [
        { to: '/admin', label: 'Home', icon: '⊞' },
        { to: '/admin/users', label: 'Users', icon: '👥' },
        { to: '/admin/deposits', label: 'Deposits', icon: '💰' },
        { to: '/admin/kyc', label: 'KYC', icon: '🛡️' },
        { to: '/admin/transactions', label: 'Transactions', icon: '🧾' },
        { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">Cradera</div>
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
                <button onClick={handleLogout} className="sidebar-logout-btn">
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
