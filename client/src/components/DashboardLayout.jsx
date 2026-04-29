import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div className="sidebar-backdrop" onClick={closeSidebar}></div>
            )}

            <div className="dashboard-main">
                <Topbar onMenuClick={toggleSidebar} />
                <div className="dashboard-content-inner">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
