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

    return (
        <DashboardLayout title="Referral Program">
            <div className="dashboard-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto', fontWeight: '300' }}>
                <div className="dashboard-header-responsive" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        
                    </div>
                </div>

                <div className="dash-card referral-main-card" style={{ 
                    background: 'linear-gradient(135deg, #5170ff 0%, #3d58cc 100%)', 
                    color: 'white', 
                    padding: '2rem',
                    marginBottom: '3rem',
                    border: 'none',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(81, 112, 255, 0.15)'
                }}>
                    <div className="referral-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', fontWeight: '400' }}>Your Referral Link</h3>
                            <div className="referral-link-container" style={{ 
                                background: 'rgba(255, 255, 255, 0.1)', 
                                padding: '0.75rem 1rem', 
                                borderRadius: '12px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                marginBottom: '1.5rem',
                                width: '100%',
                                overflow: 'hidden'
                            }}>
                                <span className="referral-link-text" style={{ fontSize: '0.9rem', fontWeight: '400', opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>
                                    {referralLink}
                                </span>
                                <button 
                                    onClick={copyLinkToClipboard}
                                    disabled={!stats.referralCode}
                                    style={{ 
                                        background: 'white', 
                                        color: '#5170ff', 
                                        border: 'none', 
                                        padding: '0.6rem 1.25rem', 
                                        borderRadius: '10px', 
                                        fontWeight: '400',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        whiteSpace: 'nowrap',
                                        transition: 'transform 0.2s'
                                    }}
                                >
                                    Copy Link
                                </button>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: '1.6', fontWeight: '300' }}>
                                Share this unique link with your network. When they sign up and start trading, you automatically earn commissions on their activities.
                            </p>
                        </div>

                        <div className="referral-stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', width: '100%' }}>
                            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
                                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.4rem', fontWeight: '400', textTransform: 'uppercase' }}>Total Referrals</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400' }}>{stats.referralCount}</h2>
                            </div>
                            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
                                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.4rem', fontWeight: '400', textTransform: 'uppercase' }}>Total Earned</p>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400' }}>₦{stats.totalEarned.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works Section */}
                <div style={{ marginBottom: '4rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary)' }}>How It Works</h3>
                    <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { step: '01', title: 'Share your link', desc: 'Copy your unique referral link and share it with your friends via social media or email.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
                            { step: '02', title: 'User signs up', desc: 'Your friends sign up to Cradera using your referral link and complete their verification.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> },
                            { step: '03', title: 'Earn rewards', desc: 'Receive instant rewards and commissions every time your referrals make a transaction.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
                        ].map((item, i) => (
                            <div key={i} className="dash-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                                <div style={{ color: '#94a3b8', marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#5170ff', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Step {item.step}</span>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '400', marginBottom: '0.75rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', fontWeight: '300' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Table */}
                <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #eee' }}>
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
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                                                    SUCCESS
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
        </DashboardLayout>
    );
};

export default Referral;
