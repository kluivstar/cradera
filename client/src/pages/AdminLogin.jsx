import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // isAdmin is hardcoded to true here
            await login(email, password, true);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Admin login failed. Unauthorized access.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-logo">Cradera Hub</h1>
                    <p className="auth-subtitle">Platform Management Portal</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Admin Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="staff@cradera.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Security Key</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ padding: '1rem 0', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                            Authorized Personnel Only
                        </p>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Accessing Hub...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                   Go back to <a href="/login" style={{ color: 'var(--color-text-secondary)' }}>Public Login</a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
