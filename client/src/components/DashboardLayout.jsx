import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="dashboard-main">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} title={title} />
                <div className="dashboard-content-inner">
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
