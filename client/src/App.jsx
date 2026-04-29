import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/user/UserDashboard';
import Products from './pages/user/Products';
import Deposit from './pages/user/Deposit';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDeposits from './pages/admin/ManageDeposits';
import ManageAssets from './pages/admin/ManageAssets';
import ManageUsers from './pages/admin/ManageUsers';
import KYCSubmission from './pages/user/KYCSubmission';
import ManageKYC from './pages/admin/ManageKYC';
import Transactions from './pages/user/Transactions';
import ManageTransactions from './pages/admin/ManageTransactions';
import Convert from './pages/user/Convert';
import DashboardLayout from './components/DashboardLayout';

const PlaceholderPage = ({ title }) => (
    <DashboardLayout>
        <div className="dashboard-content fade-in">
            <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '500', color: 'var(--color-primary)' }}>{title}</h1>
                <p className="dashboard-subtitle">This feature is currently under development.</p>
            </div>
            <div className="dash-card" style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', color: 'var(--color-primary)', opacity: 0.1 }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }}>We're working hard to bring you this service soon.</p>
            </div>
        </div>
    </DashboardLayout>
);

// Redirects authenticated users away from login/register
const GuestRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated) {
        return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={
                <GuestRoute><Login /></GuestRoute>
            } />
            <Route path="/admin/login" element={
                <GuestRoute><AdminLogin /></GuestRoute>
            } />
            <Route path="/register" element={
                <GuestRoute><Register /></GuestRoute>
            } />

            {/* User Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/dashboard/products" element={
                <ProtectedRoute><Products /></ProtectedRoute>
            } />
            <Route path="/dashboard/transactions" element={
                <ProtectedRoute><Transactions /></ProtectedRoute>
            } />
            <Route path="/dashboard/deposits" element={
                <ProtectedRoute><Deposit /></ProtectedRoute>
            } />
            <Route path="/dashboard/kyc" element={
                <ProtectedRoute><KYCSubmission /></ProtectedRoute>
            } />
            <Route path="/dashboard/convert" element={
                <ProtectedRoute><Convert /></ProtectedRoute>
            } />
            <Route path="/dashboard/referral" element={
                <ProtectedRoute><PlaceholderPage title="Referral Program" /></ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
                <ProtectedRoute><PlaceholderPage title="Account Settings" /></ProtectedRoute>
            } />
            <Route path="/dashboard/support" element={
                <ProtectedRoute><PlaceholderPage title="Help & Support" /></ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>
            } />
            <Route path="/admin/deposits" element={
                <ProtectedRoute adminOnly><ManageDeposits /></ProtectedRoute>
            } />
            <Route path="/admin/kyc" element={
                <ProtectedRoute adminOnly><ManageKYC /></ProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
                <ProtectedRoute adminOnly><ManageTransactions /></ProtectedRoute>
            } />
            <Route path="/admin/assets" element={
                <ProtectedRoute adminOnly><ManageAssets /></ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
                <ProtectedRoute adminOnly><PlaceholderPage title="Platform Settings" /></ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
