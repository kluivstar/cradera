import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const Deposit = () => {
    const [assets, setAssets] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        assetType: '',
        network: '',
        amount: '',
        txHash: '',
        fromAddress: ''
    });

    const [selectedAsset, setSelectedAsset] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [assetsRes, depositsRes] = await Promise.all([
                api.get('/assets'),
                api.get('/deposits/me')
            ]);
            setAssets(assetsRes.data);
            setDeposits(depositsRes.data.deposits);
            
            if (assetsRes.data.length > 0) {
                const firstAsset = assetsRes.data[0];
                setSelectedAsset(firstAsset);
                setFormData(prev => ({
                    ...prev,
                    assetType: firstAsset.symbol,
                    network: firstAsset.networks[0]?.name || ''
                }));
            }
        } catch (err) {
            console.error('Failed to fetch data');
            setError('Failed to load deposit information.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssetChange = (e) => {
        const symbol = e.target.value;
        const asset = assets.find(a => a.symbol === symbol);
        setSelectedAsset(asset);
        setFormData({ 
            ...formData, 
            assetType: symbol, 
            network: asset?.networks[0]?.name || '' 
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/deposits', {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setSuccess('Deposit request submitted successfully!');
            setFormData(prev => ({
                ...prev,
                amount: '',
                txHash: '',
                fromAddress: ''
            }));
            const depositsRes = await api.get('/deposits/me');
            setDeposits(depositsRes.data.deposits);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit deposit');
        } finally {
            setSubmitting(false);
        }
    };

    const getWalletAddress = () => {
        if (!selectedAsset || !formData.network) return "Select network...";
        const network = selectedAsset.networks.find(n => n.name === formData.network);
        return network ? network.address : "Address not found";
    };

    const copyToClipboard = () => {
        const addr = getWalletAddress();
        if (addr === "Select network..." || addr === "Address not found") return;
        navigator.clipboard.writeText(addr);
        alert('Address copied to clipboard!');
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-screen"><div className="loading-spinner"></div><p>Syncing with blockchain gateway...</p></div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                        Fund Account
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        Transfer assets to your unique platform wallet to begin trading.
                    </p>
                </div>

                {assets.length === 0 ? (
                    <div className="dash-card" style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                            </div>
                        </div>
                        <h3>No Assets Available</h3>
                        <p>Deposits are currently unavailable. Please contact support.</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1.2fr 0.8fr', 
                        gap: '1.25rem',
                        alignItems: 'start'
                    }}>
                        {/* Left Column: Form & Guide */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            
                            {/* Modern Deposit Form */}
                            <div className="dash-card" style={{ padding: '1.5rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: '500' }}>1. Payment Details</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>Choose your asset and copy the destination address.</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '500' }}>Select Asset</label>
                                        <select 
                                            name="assetType" 
                                            value={formData.assetType} 
                                            onChange={handleAssetChange} 
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem', fontWeight: '500' }}
                                        >
                                            {assets.map(a => (
                                                <option key={a.symbol} value={a.symbol}>{a.icon} {a.name} ({a.symbol})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '500' }}>Network</label>
                                        <select 
                                            name="network" 
                                            value={formData.network} 
                                            onChange={handleChange} 
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem', fontWeight: '500' }}
                                        >
                                            {selectedAsset?.networks.map(n => (
                                                <option key={n.name} value={n.name}>{n.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ 
                                    background: 'var(--color-primary)', 
                                    color: 'white', 
                                    padding: '1.25rem', 
                                    borderRadius: '12px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{ position: 'absolute', right: '-15px', top: '-15px', color: 'white', opacity: 0.1 }}>
                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                        </svg>
                                    </div>
                                    <label style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', opacity: 0.7, fontWeight: '500' }}>
                                        Destination {formData.assetType} Address
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                                        <code style={{ fontSize: '0.95rem', wordBreak: 'break-all', fontWeight: '500', flex: 1, letterSpacing: '0.02em' }}>
                                            {getWalletAddress()}
                                        </code>
                                        <button 
                                            onClick={copyToClipboard}
                                            style={{ 
                                                background: 'var(--color-accent)', 
                                                color: 'var(--color-primary)', 
                                                border: 'none', 
                                                padding: '0.5rem 1rem', 
                                                borderRadius: '8px', 
                                                fontSize: '0.8125rem', 
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)'
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                                        </svg>
                                        Only send {formData.assetType} via {formData.network} network.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: '500' }}>2. Confirmation Form</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>Submit your transaction hash for verification.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                                    {success && <div style={{ background: '#ECFDF5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #10B98133' }}>{success}</div>}
                                    
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Amount Sent (USD Value)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontWeight: '500', fontSize: '0.875rem' }}>$</span>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={formData.amount} 
                                                onChange={handleChange} 
                                                placeholder="0.00" 
                                                required 
                                                style={{ width: '100%', padding: '0.625rem 0.625rem 0.625rem 1.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.95rem', fontWeight: '500' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Transaction Hash (TXID)</label>
                                        <input 
                                            type="text" 
                                            name="txHash" 
                                            value={formData.txHash} 
                                            onChange={handleChange} 
                                            placeholder="Paste the unique transaction ID" 
                                            required 
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Your Sending Wallet Address</label>
                                        <input 
                                            type="text" 
                                            name="fromAddress" 
                                            value={formData.fromAddress} 
                                            onChange={handleChange} 
                                            placeholder="Address you sent from" 
                                            required 
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-accent" 
                                        disabled={submitting} 
                                        style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', fontWeight: '500', borderRadius: '10px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)' }}
                                    >
                                        {submitting ? 'Verifying...' : 'Confirm Payment'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: History */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="dash-card" style={{ padding: '1.25rem', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: '500' }}>Recent Deposits</h3>
                                    <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '500', cursor: 'pointer', fontSize: '0.8125rem' }}>Refresh</button>
                                </div>

                                {deposits.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', opacity: 0.1 }}>
                                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                                            </svg>
                                        </div>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No funding history found.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {deposits.slice(0, 8).map((d) => (
                                            <div key={d._id} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                padding: '0.75rem', 
                                                borderRadius: '10px', 
                                                background: '#F9FAFB',
                                                background: '#F9FAFB'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '1rem', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                                        {assets.find(a => a.symbol === d.assetType)?.icon || '💰'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{d.assetType}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-primary)' }}>${d.amount.toLocaleString()}</div>
                                                    <span className={`status-badge status-${d.status}`} style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>{d.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Deposit;
