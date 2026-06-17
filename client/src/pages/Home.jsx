import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleWaitlistSubmit = (e) => {
        e.preventDefault();
        if(email) {
            setIsSubmitted(true);
            setTimeout(() => {
                setEmail('');
                setIsSubmitted(false);
            }, 5000);
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--color-bg)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navbar */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Cradera Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none', border: '1px solid #e2e8f0', color: 'var(--color-text-secondary)', background: 'transparent' }}>
                        Log In
                    </Link>
                    <a href="#early-access" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', textDecoration: 'none' }}>
                        Early Access
                    </a>
                </div>
            </nav>

            {/* Hero Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 5%', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    The Next Generation of <br />
                    <span style={{ color: '#5170ff' }}>Digital Assets</span>
                </h1>
                
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                    Cradera is building a seamless, secure, and intuitive platform for all your digital transactions. Coming soon.
                </p>

                <div className="dash-card" id="early-access" style={{ padding: '3rem 2rem', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '500' }}>Join the Waitlist</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Be the first to know when we launch and get early access.</p>

                    {isSubmitted ? (
                        <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '12px', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>You're on the list!</span>
                        </div>
                    ) : (
                        <form onSubmit={handleWaitlistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ 
                                    padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', 
                                    outline: 'none', width: '100%', fontSize: '0.95rem',
                                    color: 'var(--color-primary)', background: '#f8fafc'
                                }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', width: '100%', fontSize: '1rem', fontWeight: '500' }}>
                                Notify Me
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5170ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>24/7 Availability</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Bank-Grade Security</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Live Market Rates</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #f1f5f9', padding: '2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>© 2026 Cradera. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="mailto:hello@cradera.com" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>hello@cradera.com</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
