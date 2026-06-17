import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, title, headerContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Only show back button if we are not on the main dashboard home
    const showBack = location.pathname !== '/dashboard';

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
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
