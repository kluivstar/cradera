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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(stats.referralCode);
        alert('Referral code copied to clipboard!');
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header">
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Referral Program</h1>
                    <p className="dashboard-subtitle">Invite your friends and earn rewards for every successful signup.</p>
                </div>

                <div className="grid-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
                    {/* Referral Code Card */}
                    <div className="dash-card" style={{ background: 'linear-gradient(135deg, #5170ff 0%, #3b82f6 100%)', color: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '500' }}>Your Referral Code</h3>
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.15)', 
                            padding: '1.5rem', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <span style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '2px' }}>{stats.referralCode || '------'}</span>
                            <button 
                                onClick={copyToClipboard}
                                style={{ 
                                    background: 'white', 
                                    color: '#5170ff', 
                                    border: 'none', 
                                    padding: '0.6rem 1.2rem', 
                                    borderRadius: '8px', 
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Copy Code
                            </button>
                        </div>
                        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.9 }}>
                            Share this code with your friends. They enter it during registration, and you both get rewarded!
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="dash-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Total Referrals</p>
                            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{stats.referralCount}</h2>
                        </div>
                        <div className="dash-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Total Rewards</p>
                            <h2 style={{ fontSize: '2rem', color: '#10B981' }}>₦{stats.totalEarned.toLocaleString()}</h2>
                        </div>
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
