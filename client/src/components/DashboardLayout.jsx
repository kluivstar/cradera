import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const ANNOUNCEMENT = "🎉 Cradera is live! Sell your crypto instantly and get paid in Naira.";

const DashboardLayout = ({ children, title, headerContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Only show back button if we are not on the main dashboard home
    const showBack = location.pathname !== '/dashboard';

    return (
        <div
            className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}
            style={{ '--announcement-height': '60px' }}
        >
            <style>{`:root { --announcement-height: 40px; }`}</style>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="announcement-bar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {ANNOUNCEMENT}
            </div>
            <div className="dashboard-main" >
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} title={title} headerContent={headerContent} />
                <div className="dashboard-content-inner" style={{ padding: '0 25px 2rem 25px', borderRadius: '10px' }}>
                    {children}
                </div>
            </div>
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
