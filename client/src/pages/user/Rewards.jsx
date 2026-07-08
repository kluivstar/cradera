import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Rewards = () => {
    const [rewardsData, setRewardsData] = useState({
        availablePoints: 0,
        lifetimePoints: 0,
        giftPoints: 0,
        activeCampaigns: [],
        history: []
    });
    const [loading, setLoading] = useState(true);
    const [convertAmount, setConvertAmount] = useState('');
    const [converting, setConverting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchRewards = async () => {
        try {
            const res = await api.get('/rewards/me');
            setRewardsData(res.data);
            setError('');
        } catch (err) {
            setError('Failed to load reward profile data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
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
            const res = await api.post('/rewards/convert', { amount });
            setSuccess(`Successfully converted ${amount} Reward Points to Gift Points!`);
            setConvertAmount('');
            fetchRewards();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to convert points.');
        } finally {
            setConverting(false);
        }
    };

    // Calculate current Tier based on lifetime points
    const getLoyaltyTier = (pts) => {
        if (pts >= 10000) return { name: 'Platinum', next: 'Max LevelReached', progress: 100, min: 10000 };
        if (pts >= 2500) return { name: 'Gold', next: 'Platinum (10,000 pts)', progress: ((pts - 2500) / 7500) * 100, min: 2500 };
        if (pts >= 500) return { name: 'Silver', next: 'Gold (2,500 pts)', progress: ((pts - 500) / 2000) * 100, min: 500 };
        return { name: 'Bronze', next: 'Silver (500 pts)', progress: (pts / 500) * 100, min: 0 };
    };

    const tier = getLoyaltyTier(rewardsData.lifetimePoints);

    return (
        <DashboardLayout title="My Rewards">
            <div className="dashboard-content fade-in" style={{ textAlign: 'left', fontFamily: 'var(--font-base)' }}>
                
                {/* Header */}
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '500', color: 'var(--color-primary)' }}>Cradera Rewards</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Earn points through trading, referrals, and loyalty campaigns, and convert them to Gift Points.</p>
                </div>

                {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                {success && <div className="alert-banner" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '1.5rem' }}>{success}</div>}

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                ) : (
                    <div>
                        {/* Stats Widgets */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="dash-card" style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Available Reward Points</span>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: 'var(--color-primary)' }}>{rewardsData.availablePoints.toLocaleString()}</h2>
                                <p style={{ fontSize: '0.75rem', color: '#10b981', margin: 0 }}>Eligible for conversion</p>
                            </div>
                            
                            <div className="dash-card" style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Lifetime Points Earned</span>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: 'var(--color-primary)' }}>{rewardsData.lifetimePoints.toLocaleString()}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Overall account level score</p>
                            </div>

                            <div className="dash-card" style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Loyalty Level Tier</span>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: '#8b5cf6' }}>{tier.name}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Next: {tier.next}</p>
                            </div>
                        </div>

                        {/* Mid Section: Conversion Card & Loyalty Progress */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
                            {/* Conversion Box */}
                            <div className="dash-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem' }}>Convert to Gift Points</h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                    Convert your available Reward Points into usable Gift Points. Conversion rate: <strong>1 Point = 1 Gift Point</strong>.
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

                            {/* Loyalty Milestone Stepper */}
                            <div className="dash-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Milestone Progression</h3>
                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{ width: `${tier.progress}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #5170ff)', borderRadius: '4px' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                                    You have completed {Math.round(tier.progress)}% of the silver progress track score.
                                </p>
                                
                                {/* Stepper steps */}
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

                        {/* Active Campaign Programs */}
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

                        {/* Ledger Log History */}
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
                                                    <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>
                                                        {item.category}
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                                                        {item.amount.toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>
                                                        {item.description}
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                                                        {new Date(item.createdAt).toLocaleDateString()}
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
        </DashboardLayout>
    );
};

export default Rewards;
