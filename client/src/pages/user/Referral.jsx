import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Referral = () => {
    const [stats, setStats] = useState({ referralCode: '', referralCount: 0, totalEarned: 0 });
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, listRes] = await Promise.all([
                api.get('/referrals/stats'),
                api.get('/referrals/me')
            ]);
            setStats(statsRes.data);
            setReferrals(listRes.data.referrals);
        } catch (err) {
            console.error('Error fetching referral data');
        } finally {
            setLoading(false);
        }
    };

    const referralLink = stats.referralCode ? `${window.location.origin}/signup?ref=${stats.referralCode}` : 'Loading...';

    const copyLinkToClipboard = () => {
        if (!stats.referralCode) return;
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    const scrollToHistory = () => {
        document.getElementById('referral-history')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto', fontWeight: '500' }}>
                <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', fontSize: '1.75rem' }}>Referral Program</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Invite your friends and earn rewards for every successful transaction.</p>
                </div>

                {/* Section 1: The Dashboard */}
                <div className="dash-card referral-dashboard-grid" style={{ padding: '0', overflow: 'hidden', border: 'none', marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                    {/* Left: Invite Info */}
                    <div style={{ padding: '2.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>Invite your friends</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '400px' }}>
                            Share your referral link with friends. When they sign up and trade, you'll earn a commission on every transaction they make.
                        </p>
                        
                        <div style={{ background: '#F9FAFB', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #F1F5F9' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>
                                {referralLink}
                            </span>
                            <button onClick={copyLinkToClipboard} style={{ background: 'none', border: 'none', color: '#5170ff', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                Copy
                            </button>
                        </div>
                    </div>

                    {/* Right: Stats Section */}
                    <div style={{ padding: '2.5rem', background: '#5170ff', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Referrals</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '600' }}>{stats.referralCount}</h2>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Earnings</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '600' }}>₦{stats.totalEarned.toLocaleString()}</h2>
                        </div>
                        <button 
                            onClick={scrollToHistory}
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.15)', 
                                border: '1px solid rgba(255, 255, 255, 0.3)', 
                                color: 'white', 
                                padding: '0.75rem', 
                                borderRadius: '12px', 
                                fontSize: '0.85rem', 
                                fontWeight: '600', 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
                        >
                            View Details
                        </button>
                    </div>
                </div>

                {/* Section 2: How It Works (Quick Action Style) */}
                <div style={{ marginBottom: '3.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>How it works</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        {[
                            { 
                                title: 'Share your link', 
                                desc: 'Send your link to friends', 
                                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg> 
                            },
                            { 
                                title: 'Friends sign up', 
                                desc: 'They join and verify account', 
                                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> 
                            },
                            { 
                                title: 'Earn commissions', 
                                desc: 'Get paid on every trade', 
                                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg> 
                            }
                        ].map((item, i) => (
                            <div key={i} className="dash-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                                <div style={{ 
                                    width: '40px', height: '40px', borderRadius: '10px', background: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    marginBottom: '0.75rem', margin: '0 auto 0.75rem auto',
                                    color: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: '600' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: History Table */}
                <div id="referral-history" className="dash-card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Referral History</h3>
                    </div>
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Date Joined</th>
                                    <th style={{ textAlign: 'right' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem' }}><div className="loading-spinner"></div></td></tr>
                                ) : referrals.length === 0 ? (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>You haven't referred anyone yet.</td></tr>
                                ) : (
                                    referrals.map((ref, index) => (
                                        <tr key={index}>
                                            <td>
                                                <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>{ref.email.split('@')[0]}***@{ref.email.split('@')[1]}</p>
                                            </td>
                                            <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                    ACTIVE
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .referral-dashboard-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default Referral;
