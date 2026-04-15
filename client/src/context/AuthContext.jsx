import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check for existing token and rehydrate user
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('cradera_token');
            if (token) {
                try {
                    const res = await api.get('/users/me');
                    setUser(res.data.user);
                } catch (err) {
                    // Token is invalid or expired
                    localStorage.removeItem('cradera_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password, isAdmin = false) => {
        const endpoint = isAdmin ? '/admin/login' : '/auth/login';
        const res = await api.post(endpoint, { email, password });
        const { token, user: userData } = res.data;

        localStorage.setItem('cradera_token', token);
        setUser(userData);

        return userData;
    };

    const register = async (email, password) => {
        const res = await api.post('/auth/register', { email, password });
        const { token, user: userData } = res.data;

        localStorage.setItem('cradera_token', token);
        setUser(userData);

        return userData;
    };

    const logout = () => {
        localStorage.removeItem('cradera_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
