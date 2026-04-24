import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // If they were trying to reach an admin page, send to admin login
        const redirectPath = adminOnly ? '/admin/login' : '/login';
        return <Navigate to={redirectPath} replace />;
    }

    if (adminOnly && !isAdmin) {
        // Logged in as user but trying to access admin
        return <Navigate to="/dashboard" replace />;
    }

    if (!adminOnly && isAdmin) {
        // Logged in as admin but trying to access user-only pages
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedRoute;
