import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Earn = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Rewards data state
    const [rewardsData, setRewardsData] = useState({
        availablePoints: 0,
        lifetimePoints: 0,
        giftPoints: 0,
        activeCampaigns: [],
        history: []
    });
    const [convertAmount, setConvertAmount] = useState('');
    const [converting, setConverting] = useState(false);

    // Referral data state
    const [referralStats, setReferralStats] = useState({ referralCode: '', referralCount: 0, totalEarned: 0 });
    const [referrals, setReferrals] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rewardsRes, refStatsRes, refListRes] = await Promise.all([
                api.get('/rewards/me'),
                api.get('/referrals/stats'),
                api.get('/referrals/me')
            ]);
            setRewardsData(rewardsRes.data);
            setReferralStats(refStatsRes.data);
            setReferrals(refListRes.data.referrals);
            setError('');
        } catch (err) {
            setError('Failed to load earning metrics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConvert = async (e) => {
        e.preventDefault();
        const amount = Number(convertAmount);
        
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount to convert.');
            return;
        }

        if (amount > rewardsData.availablePoints) {
            setError('Insufficient reward points available.');
            return;
        }

        setConverting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/rewards/convert', { amount });
            setSuccess(`Successfully converted ${amount} Reward Points to Gift Points!`);
            setConvertAmount('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to convert points.');
        } finally {
            setConverting(false);
        }
    };

    const referralLink = referralStats.referralCode ? `${window.location.origin}/signup?ref=${referralStats.referralCode}` : 'Loading...';

    const copyLinkToClipboard = () => {
        if (!referralStats.referralCode) return;
        navigator.clipboard.writeText(referralLink);
        alert('Referral link copied to clipboard!');
    };

    const getLoyaltyTier = (pts) => {
        if (pts >= 10000) return { name: 'Platinum', next: 'Max Level Reached', progress: 100 };
        if (pts >= 2500) return { name: 'Gold', next: 'Platinum (10,000 pts)', progress: ((pts - 2500) / 7500) * 100 };
        if (pts >= 500) return { name: 'Silver', next: 'Gold (2,500 pts)', progress: ((pts - 500) / 2000) * 100 };
        return { name: 'Bronze', next: 'Silver (500 pts)', progress: (pts / 500) * 100 };
    };

    const tier = getLoyaltyTier(rewardsData.lifetimePoints);

    // Assume 1 point = ₦1 for visual overview aggregation
    const totalEarnings = (rewardsData.lifetimePoints * 1) + referralStats.totalEarned;
    const availableEarnings = (rewardsData.availablePoints * 1) + referralStats.totalEarned; // Referral earnings instantly credited to main fiat balance, but points are available here for conversion

    return (
        <DashboardLayout title="Earn Hub">
            <div className="dashboard-content fade-in" style={{ textAlign: 'left', fontFamily: 'var(--font-base)' }}>
                {/* Header */}
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '500', color: 'var(--color-primary)' }}>Earn Hub</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Your single workspace for all Cradera cashback, referral earnings, and campaigns.</p>
                </div>

                {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                {success && <div className="alert-banner" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '1.5rem' }}>{success}</div>}

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    {[
                        { id: 'overview', label: 'Overview', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> },
                        { id: 'rewards', label: 'Cashback Rewards', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg> },
                        { id: 'referrals', label: 'Referral Earnings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '15px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                ) : (
                    <div>
                        {/* ================= OVERVIEW TAB ================= */}
                        {activeTab === 'overview' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    <div className="dash-card" style={{ padding: '1.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Total Lifetime Earnings</span>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: 'var(--color-primary)' }}>₦{totalEarnings.toLocaleString()}</h2>
                                        <p style={{ fontSize: '0.75rem', color: '#10b981', margin: 0 }}>Rewards + Referral Commissions</p>
                                    </div>
                                    <div className="dash-card" style={{ padding: '1.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Available Rewards Balance</span>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: 'var(--color-primary)' }}>{rewardsData.availablePoints.toLocaleString()} Points</h2>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Swappable for Gift Points</p>
                                    </div>
                                    <div className="dash-card" style={{ padding: '1.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Total Referral commissions</span>
                                        <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: '#8b5cf6' }}>₦{referralStats.totalEarned.toLocaleString()}</h2>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Credited directly to Fiat Wallet</p>
                                    </div>
                                </div>

                                {/* Overview Earning Channels */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    <div className="dash-card" style={{ padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem' }}>Cashback Program</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                            Earn cashback points on your trades, sign-on campaigns, and loyalty multipliers. Your current loyalty tier is <strong>{tier.name}</strong>.
                                        </p>
                                        <button onClick={() => setActiveTab('rewards')} className="btn btn-second" style={{ border: '1px solid var(--color-border)', cursor: 'pointer', background: 'white' }}>Manage Cashback</button>
                                    </div>
                                    <div className="dash-card" style={{ padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem' }}>Referral Commissions</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                            Invite friends using your unique referral code. You have referred <strong>{referralStats.referralCount}</strong> friends and earned commission rewards.
                                        </p>
                                        <button onClick={() => setActiveTab('referrals')} className="btn btn-second" style={{ border: '1px solid var(--color-border)', cursor: 'pointer', background: 'white' }}>View Referrals</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= REWARDS TAB ================= */}
                        {activeTab === 'rewards' && (
                            <div>
                                {/* Mid Row: Conversion Box & Progression */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
                                    {/* Conversion Box */}
                                    <div className="dash-card" style={{ padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem' }}>Convert to Gift Points</h3>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                            Convert available Reward Points into usable Gift Points. Conversion rate: <strong>1 Point = 1 Gift Point</strong>.
                                        </p>
                                        <form onSubmit={handleConvert}>
                                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                                <label style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>AMOUNT TO CONVERT</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input 
                                                        type="number" 
                                                        placeholder="e.g. 500" 
                                                        value={convertAmount}
                                                        onChange={(e) => setConvertAmount(e.target.value)}
                                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                                                        required
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setConvertAmount(rewardsData.availablePoints)}
                                                        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                                                    >
                                                        MAX
                                                    </button>
                                                </div>
                                            </div>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary" 
                                                disabled={converting || rewardsData.availablePoints <= 0}
                                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                {converting ? 'Converting...' : 'Convert Instantly'}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Loyalty Progression */}
                                    <div className="dash-card" style={{ padding: '2rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Milestone Progression</h3>
                                        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <div style={{ width: `${tier.progress}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #5170ff)', borderRadius: '4px' }} />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                                            You have completed {Math.round(tier.progress)}% of the current tier progress.
                                        </p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                                            <div>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#8b5cf6', margin: '0 auto 0.5rem auto' }} />
                                                Bronze
                                            </div>
                                            <div>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: rewardsData.lifetimePoints >= 500 ? '#8b5cf6' : '#cbd5e1', margin: '0 auto 0.5rem auto' }} />
                                                Silver (500)
                                            </div>
                                            <div>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: rewardsData.lifetimePoints >= 2500 ? '#8b5cf6' : '#cbd5e1', margin: '0 auto 0.5rem auto' }} />
                                                Gold (2.5k)
                                            </div>
                                            <div>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: rewardsData.lifetimePoints >= 10000 ? '#8b5cf6' : '#cbd5e1', margin: '0 auto 0.5rem auto' }} />
                                                Platinum (10k)
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Campaigns */}
                                <div style={{ marginBottom: '3rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Earning Categories</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                        {[
                                            { title: 'Trading Rewards', icon: '📈', desc: 'Earn reward multipliers on every completed trade transaction.', rate: '1.5 pts / trade' },
                                            { title: 'Referral Rewards', icon: '👥', desc: 'Invite friends using your link and earn flat bonuses when verified.', rate: '100 pts / refer' },
                                            { title: 'Promotional Rewards', icon: '🎁', desc: 'Participate in sign-on events and platform giveaways.', rate: '50 pts / event' },
                                            { title: 'Loyalty Rewards', icon: '⭐', desc: 'Receive loyalty increments based on account active durations.', rate: '10 pts / month' }
                                        ].map((c, i) => {
                                            const activeC = rewardsData.activeCampaigns.find(ac => ac.type === ['trading', 'referral', 'promo', 'loyalty'][i]);
                                            return (
                                                <div key={i} className="dash-card" style={{ padding: '1.5rem', opacity: activeC ? 1 : 0.6 }}>
                                                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{c.icon}</div>
                                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>{c.title}</h4>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', minHeight: '36px', margin: '0 0 1rem 0' }}>{c.desc}</p>
                                                    <span style={{ fontSize: '0.75rem', background: activeC ? '#e0e7ff' : '#f1f5f9', color: activeC ? '#4f46e5' : '#64748b', fontWeight: '600', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                                        {activeC ? `Active: ${activeC.rate}x` : 'Inactive'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* History Table */}
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Rewards History</h3>
                                    <div className="dash-card" style={{ padding: 0, overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Type</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Category</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Amount</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Description</th>
                                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rewardsData.history.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No rewards transactions recorded yet.</td>
                                                    </tr>
                                                ) : (
                                                    rewardsData.history.map(item => (
                                                        <tr key={item._id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                                                            <td style={{ padding: '1rem 1.5rem', textTransform: 'uppercase', fontWeight: '600', color: item.type === 'credit' ? '#10b981' : '#ef4444' }}>
                                                                {item.type}
                                                            </td>
                                                            <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{item.category}</td>
                                                            <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{item.amount.toLocaleString()}</td>
                                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{item.description}</td>
                                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= REFERRALS TAB ================= */}
                        {activeTab === 'referrals' && (
                            <div>
                                <div className="dash-card referral-main-card" style={{ 
                                    background: 'linear-gradient(135deg, #5170ff 0%, #3d58cc 100%)', 
                                    color: 'white', 
                                    padding: '2rem',
                                    marginBottom: '3rem',
                                    border: 'none',
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 40px rgba(81, 112, 255, 0.15)'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', fontWeight: '400' }}>Your Referral Link</h3>
                                            <div style={{ 
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
                                                <span style={{ fontSize: '0.9rem', fontWeight: '400', opacity: 0.9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '1rem' }}>
                                                    {referralLink}
                                                </span>
                                                <button 
                                                    onClick={copyLinkToClipboard}
                                                    disabled={!referralStats.referralCode}
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
                                                Share this link. When they sign up and trade, you earn commissions on their activity.
                                            </p>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', width: '100%' }}>
                                            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
                                                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.4rem', fontWeight: '400', textTransform: 'uppercase' }}>Total Referrals</p>
                                                <h2 style={{ fontSize: '2rem', fontWeight: '400' }}>{referralStats.referralCount}</h2>
                                            </div>
                                            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
                                                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.4rem', fontWeight: '400', textTransform: 'uppercase' }}>Total Commission</p>
                                                <h2 style={{ fontSize: '2rem', fontWeight: '400' }}>₦{referralStats.totalEarned.toLocaleString()}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Referral Steps */}
                                <div style={{ marginBottom: '4rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary)' }}>How It Works</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                        {[
                                            { step: '01', title: 'Share your link', desc: 'Copy your unique referral link and share it with friends via social media.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
                                            { step: '02', title: 'User signs up', desc: 'They register on Cradera using your link and verify their profile.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> },
                                            { step: '03', title: 'Earn commission', desc: 'Receive flat rewards and commissions whenever they trade.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
                                        ].map((item, i) => (
                                            <div key={i} className="dash-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid #F1F5F9', borderRadius: '12px' }}>
                                                <div style={{ color: '#94a3b8', marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#5170ff', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>Step {item.step}</span>
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
                                                {referrals.length === 0 ? (
                                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>You haven't referred anyone yet.</td></tr>
                                                ) : (
                                                    referrals.map((ref, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                                                                    {ref.email.split('@')[0]}***@{ref.email.split('@')[1]}
                                                                </p>
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
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Earn;
