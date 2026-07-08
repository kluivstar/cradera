import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageRewards = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [analytics, setAnalytics] = useState({
        stats: [],
        categoryStats: [],
        conversions: 0,
        totalUsersWithRewards: 0,
        ledgerLogs: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form inputs for new campaign
    const [campName, setCampName] = useState('');
    const [campType, setCampType] = useState('trading');
    const [campRate, setCampRate] = useState('');
    const [campEndDate, setCampEndDate] = useState('');

    // Form inputs for adjustment
    const [adjEmail, setAdjEmail] = useState('');
    const [adjType, setAdjType] = useState('credit');
    const [adjAmount, setAdjAmount] = useState('');
    const [adjCategory, setAdjCategory] = useState('promo');
    const [adjDesc, setAdjDesc] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cRes, aRes] = await Promise.all([
                api.get('/rewards/admin/campaigns'),
                api.get('/rewards/admin/analytics')
            ]);
            setCampaigns(cRes.data.campaigns);
            setAnalytics(aRes.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch rewards management data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/rewards/admin/campaigns', {
                name: campName,
                type: campType,
                rate: Number(campRate),
                endDate: campEndDate || undefined
            });
            setSuccess('Reward campaign created successfully!');
            setCampName('');
            setCampRate('');
            setCampEndDate('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create campaign.');
        }
    };

    const handleToggleCampaignStatus = async (id, currentStatus) => {
        setError('');
        setSuccess('');
        try {
            const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
            await api.patch(`/rewards/admin/campaigns/${id}`, { status: nextStatus });
            setSuccess('Campaign status toggled successfully.');
            fetchData();
        } catch (err) {
            setError('Failed to toggle campaign status.');
        }
    };

    const handleAdjustRewards = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/rewards/admin/adjust', {
                userEmail: adjEmail,
                type: adjType,
                amount: Number(adjAmount),
                category: adjCategory,
                description: adjDesc
            });
            setSuccess(`Successfully ${adjType}ed ${adjAmount} points to ${adjEmail}!`);
            setAdjEmail('');
            setAdjAmount('');
            setAdjDesc('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to adjust user rewards.');
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ textAlign: 'left', fontFamily: 'var(--font-base)' }}>
                {/* Header */}
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '500', color: 'var(--color-primary)' }}>Rewards Management</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Administer reward campaigns, toggle rates, credit/debit balances, and track conversion ledgers.</p>
                </div>

                {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                {success && <div className="alert-banner" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '1.5rem' }}>{success}</div>}

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><div className="loading-spinner"></div></div>
                ) : (
                    <div>
                        {/* Analytics Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div className="dash-card" style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Active Users With Rewards</span>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: 'var(--color-primary)' }}>{analytics.totalUsersWithRewards.toLocaleString()}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Users possessing available points</p>
                            </div>
                            <div className="dash-card" style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Total Points Issued</span>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: '#10b981' }}>
                                    {(analytics.stats.find(s => s._id === 'credit')?.totalPoints || 0).toLocaleString()}
                                </h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Sum of all credits</p>
                            </div>
                            <div className="dash-card" style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Gift Point Conversions</span>
                                <h2 style={{ fontSize: '2rem', fontWeight: '400', margin: '0.5rem 0', color: '#8b5cf6' }}>{analytics.conversions}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>Total conversion actions processed</p>
                            </div>
                        </div>

                        {/* Mid Row: Action Forms */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                            {/* Create Campaign Form */}
                            <div className="dash-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Create Reward Campaign</h3>
                                <form onSubmit={handleCreateCampaign}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>CAMPAIGN NAME</label>
                                        <input type="text" placeholder="e.g. Summer Trading Fest" value={campName} onChange={(e) => setCampName(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>CATEGORY</label>
                                            <select value={campType} onChange={(e) => setCampType(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}>
                                                <option value="trading">Trading</option>
                                                <option value="referral">Referrals</option>
                                                <option value="promo">Promo</option>
                                                <option value="loyalty">Loyalty</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>RATE / VALUE</label>
                                            <input type="number" step="0.1" placeholder="e.g. 1.5" value={campRate} onChange={(e) => setCampRate(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>END DATE (OPTIONAL)</label>
                                        <input type="date" value={campEndDate} onChange={(e) => setCampEndDate(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                                        Launch Campaign
                                    </button>
                                </form>
                            </div>

                            {/* Manual Points Adjustment Form */}
                            <div className="dash-card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Manual Points Adjustment</h3>
                                <form onSubmit={handleAdjustRewards}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>USER EMAIL</label>
                                        <input type="email" placeholder="client@gmail.com" value={adjEmail} onChange={(e) => setAdjEmail(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>ACTION TYPE</label>
                                            <select value={adjType} onChange={(e) => setAdjType(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}>
                                                <option value="credit">Credit (+)</option>
                                                <option value="debit">Debit (-)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>AMOUNT</label>
                                            <input type="number" placeholder="500" value={adjAmount} onChange={(e) => setAdjAmount(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>CATEGORY</label>
                                            <select value={adjCategory} onChange={(e) => setAdjCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}>
                                                <option value="promo">Promo</option>
                                                <option value="trading">Trading</option>
                                                <option value="referral">Referral</option>
                                                <option value="loyalty">Loyalty</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>DESCRIPTION / REASON</label>
                                        <input type="text" placeholder="e.g. Sign-on welcome gift adjustment" value={adjDesc} onChange={(e) => setAdjDesc(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                                        Commit Adjustment
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Campaigns Controller Table */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Active campaigns Program</h3>
                            <div className="dash-card" style={{ padding: 0, overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Campaign Name</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Type</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Rate</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Status</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.map(c => (
                                            <tr key={c._id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{c.name}</td>
                                                <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{c.type}</td>
                                                <td style={{ padding: '1rem 1.5rem' }}>{c.rate}x</td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <span style={{ 
                                                        background: c.status === 'active' ? '#DEF7EC' : '#FDE2E2', 
                                                        color: c.status === 'active' ? '#03543F' : '#9B1C1C', 
                                                        padding: '0.2rem 0.5rem', 
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                    <button 
                                                        onClick={() => handleToggleCampaignStatus(c._id, c.status)}
                                                        style={{
                                                            border: 'none',
                                                            background: c.status === 'active' ? '#FEE2E2' : '#E0E7FF',
                                                            color: c.status === 'active' ? '#EF4444' : '#4F46E5',
                                                            padding: '0.35rem 0.75rem',
                                                            borderRadius: '5px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {c.status === 'active' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Audit Ledger Logs */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>Platform Rewards Audit Log</h3>
                            <div className="dash-card" style={{ padding: 0, overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>User</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Action</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Category</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Amount</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Description</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.ledgerLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No global reward audit logs recorded.</td>
                                            </tr>
                                        ) : (
                                            analytics.ledgerLogs.map(log => (
                                                <tr key={log._id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
                                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{log.userId?.email || 'System'}</td>
                                                    <td style={{ padding: '1rem 1.5rem', textTransform: 'uppercase', fontWeight: '600', color: log.type === 'credit' ? '#10b981' : '#ef4444' }}>
                                                        {log.type}
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{log.category}</td>
                                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{log.amount.toLocaleString()}</td>
                                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{log.description}</td>
                                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{new Date(log.createdAt).toLocaleDateString()}</td>
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

export default ManageRewards;
