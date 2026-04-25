import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

const UserDashboard = () => {
    const { user } = useAuth();

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1>Welcome back</h1>
                    <p className="dashboard-subtitle">Here's your account overview</p>
                </div>

                <div className="dashboard-grid">
                    {/* User Info Card */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <span className="dash-card-icon">👤</span>
                            <h3>Account Info</h3>
                        </div>
                        <div className="dash-card-body">
                            <div className="info-row">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user?.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Role</span>
                                <span className="info-value capitalize">{user?.role}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Member since</span>
                                <span className="info-value">{formatDate(user?.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* KYC Status Card */}
                    <div className="dash-card">
                        <div className="dash-card-header">
                            <span className="dash-card-icon">🛡️</span>
                            <h3>KYC Verification</h3>
                        </div>
                        <div className="dash-card-body">
                            <div className="status-display">
                                <span className="status-badge status-pending">Not Submitted</span>
                            </div>
                            <p className="status-text">
                                Complete your identity verification to unlock full platform access.
                            </p>
                        </div>
                    </div>

                    {/* Deposit History Card */}
                    <div className="dash-card dash-card-wide">
                        <div className="dash-card-header">
                            <span className="dash-card-icon">💰</span>
                            <h3>Recent Deposits</h3>
                        </div>
                        <div className="dash-card-body">
                            <div className="empty-state">
                                <div className="empty-state-icon">📭</div>
                                <p className="empty-state-text">No deposits yet</p>
                                <p className="empty-state-sub">Your deposit history will appear here once you make your first transaction.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
