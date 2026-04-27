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
                <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Fund Account
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                        Transfer assets to your unique platform wallet to begin trading.
                    </p>
                </div>

                {assets.length === 0 ? (
                    <div className="dash-card" style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3>No Assets Available</h3>
                        <p>Deposits are currently unavailable. Please contact support.</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1.2fr 0.8fr', 
                        gap: '2rem',
                        alignItems: 'start'
                    }}>
                        {/* Left Column: Form & Guide */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            
                            {/* Modern Deposit Form */}
                            <div className="dash-card" style={{ padding: '2.5rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: '700' }}>1. Payment Details</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Choose your asset and copy the destination address.</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Select Asset</label>
                                        <select 
                                            name="assetType" 
                                            value={formData.assetType} 
                                            onChange={handleAssetChange} 
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontWeight: '500' }}
                                        >
                                            {assets.map(a => (
                                                <option key={a.symbol} value={a.symbol}>{a.icon} {a.name} ({a.symbol})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Network</label>
                                        <select 
                                            name="network" 
                                            value={formData.network} 
                                            onChange={handleChange} 
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontWeight: '500' }}
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
                                    padding: '1.75rem', 
                                    borderRadius: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    marginBottom: '2.5rem'
                                }}>
                                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', fontSize: '8rem', opacity: 0.05 }}>🪙</div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.7, fontWeight: '700' }}>
                                        Destination {formData.assetType} Address
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                                        <code style={{ fontSize: '1.1rem', wordBreak: 'break-all', fontWeight: '600', flex: 1, letterSpacing: '0.02em' }}>
                                            {getWalletAddress()}
                                        </code>
                                        <button 
                                            onClick={copyToClipboard}
                                            style={{ 
                                                background: 'var(--color-accent)', 
                                                color: 'var(--color-primary)', 
                                                border: 'none', 
                                                padding: '0.75rem 1.5rem', 
                                                borderRadius: '10px', 
                                                fontSize: '0.85rem', 
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                                        ⚠️ Only send {formData.assetType} via {formData.network} network. Other assets will be lost.
                                    </p>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: '700' }}>2. Confirmation Form</h3>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Submit your transaction hash for verification.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                                    {success && <div style={{ background: '#ECFDF5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #10B98133' }}>{success}</div>}
                                    
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Amount Sent (USD Value)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontWeight: '700' }}>$</span>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={formData.amount} 
                                                onChange={handleChange} 
                                                placeholder="0.00" 
                                                required 
                                                style={{ width: '100%', padding: '1rem 1rem 1rem 2rem', borderRadius: '12px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '1.1rem', fontWeight: '600' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Transaction Hash (TXID)</label>
                                        <input 
                                            type="text" 
                                            name="txHash" 
                                            value={formData.txHash} 
                                            onChange={handleChange} 
                                            placeholder="Paste the unique transaction ID" 
                                            required 
                                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Your Sending Wallet Address</label>
                                        <input 
                                            type="text" 
                                            name="fromAddress" 
                                            value={formData.fromAddress} 
                                            onChange={handleChange} 
                                            placeholder="Address you sent from" 
                                            required 
                                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F9FAFB' }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-accent" 
                                        disabled={submitting} 
                                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '14px', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.2)' }}
                                    >
                                        {submitting ? 'Verifying on Node...' : 'Confirm Payment'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: History */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="dash-card" style={{ padding: '2rem', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: '700' }}>Recent Deposits</h3>
                                    <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>Refresh</button>
                                </div>

                                {deposits.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.1 }}>🧾</div>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No funding history found.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {deposits.slice(0, 8).map((d) => (
                                            <div key={d._id} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                padding: '1.25rem', 
                                                borderRadius: '12px', 
                                                background: '#F9FAFB',
                                                border: '1px solid var(--color-border)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '1.2rem', border: '1px solid var(--color-border)', justifyContent: 'center' }}>
                                                        {assets.find(a => a.symbol === d.assetType)?.icon || '💰'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{d.assetType}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-primary)' }}>${d.amount.toLocaleString()}</div>
                                                    <span className={`status-badge status-${d.status}`} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>{d.status}</span>
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
