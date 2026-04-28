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
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-8)' }}>
                    <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-1)' }}>
                        Fund Account
                    </h1>
                    <p className="dashboard-subtitle">
                        Transfer assets to your unique platform wallet to begin trading.
                    </p>
                </div>

                {assets.length === 0 ? (
                    <div className="dash-card" style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-4)' }}>⚠️</div>
                        <h3>No Assets Available</h3>
                        <p className="dashboard-subtitle">Deposits are currently unavailable. Please contact support.</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1.2fr 0.8fr', 
                        gap: 'var(--spacing-8)',
                        alignItems: 'start'
                    }}>
                        {/* Left Column: Form & Guide */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                            
                            {/* Modern Deposit Form */}
                            <div className="dash-card" style={{ padding: 'var(--spacing-8)' }}>
                                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                                    <h3 style={{ color: 'var(--color-primary)' }}>1. Payment Details</h3>
                                    <p className="dashboard-subtitle">Choose your asset and copy the destination address.</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>Select Asset</label>
                                        <select 
                                            name="assetType" 
                                            value={formData.assetType} 
                                            onChange={handleAssetChange} 
                                            style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}
                                        >
                                            {assets.map(a => (
                                                <option key={a.symbol} value={a.symbol}>{a.icon} {a.name} ({a.symbol})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>Network</label>
                                        <select 
                                            name="network" 
                                            value={formData.network} 
                                            onChange={handleChange} 
                                            style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}
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
                                    padding: 'var(--spacing-6)', 
                                    borderRadius: 'var(--radius-md)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    marginBottom: 'var(--spacing-8)'
                                }}>
                                    <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '5rem', opacity: 0.05, pointerEvents: 'none' }}>🪙</div>
                                    <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-3)', opacity: 0.7, fontWeight: '700' }}>
                                        Destination {formData.assetType} Address
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', position: 'relative', zIndex: 1 }}>
                                        <code style={{ fontSize: 'var(--font-size-md)', wordBreak: 'break-all', fontWeight: '600', flex: 1, letterSpacing: '0.01em' }}>
                                            {getWalletAddress()}
                                        </code>
                                        <button 
                                            onClick={copyToClipboard}
                                            className="btn"
                                            style={{ 
                                                background: 'var(--color-accent)', 
                                                color: 'var(--color-primary)', 
                                                border: 'none', 
                                                padding: '0.5rem 1rem', 
                                                fontSize: '11px'
                                            }}
                                        >
                                            COPY
                                        </button>
                                    </div>
                                    <p style={{ marginTop: 'var(--spacing-3)', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                                        ⚠️ Only send {formData.assetType} via {formData.network} network. Other assets will be lost.
                                    </p>
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                                    <h3 style={{ color: 'var(--color-primary)' }}>2. Confirmation Form</h3>
                                    <p className="dashboard-subtitle">Submit your transaction hash for verification.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {error && <div style={{ background: '#FEF2F2', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)' }}>{error}</div>}
                                    {success && <div style={{ background: '#ECFDF5', color: 'var(--color-success)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)', fontWeight: '500', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}
                                    
                                    <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
                                        <label style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-xs)' }}>Amount Sent (USD Value)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontWeight: '700', fontSize: 'var(--font-size-sm)' }}>$</span>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={formData.amount} 
                                                onChange={handleChange} 
                                                placeholder="0.00" 
                                                required 
                                                style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 1.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
                                        <label style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-xs)' }}>Transaction Hash (TXID)</label>
                                        <input 
                                            type="text" 
                                            name="txHash" 
                                            value={formData.txHash} 
                                            onChange={handleChange} 
                                            placeholder="Paste the unique transaction ID" 
                                            required 
                                            style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: 'var(--font-size-sm)' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 'var(--spacing-6)' }}>
                                        <label style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-xs)' }}>Your Sending Wallet Address</label>
                                        <input 
                                            type="text" 
                                            name="fromAddress" 
                                            value={formData.fromAddress} 
                                            onChange={handleChange} 
                                            placeholder="Address you sent from" 
                                            required 
                                            style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--color-border)', outline: 'none', background: '#F8FAFC', fontSize: 'var(--font-size-sm)' }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn" 
                                        disabled={submitting} 
                                        style={{ width: '100%', padding: '0.875rem', background: 'var(--color-primary)', color: 'white', border: 'none', fontSize: 'var(--font-size-sm)', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)' }}
                                    >
                                        {submitting ? 'Verifying on Node...' : 'Confirm Payment'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: History */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                            <div className="dash-card" style={{ padding: 'var(--spacing-6)', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-6)' }}>
                                    <h3 style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-md)' }}>Recent Deposits</h3>
                                    <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', cursor: 'pointer', fontSize: '11px' }}>REFRESH</button>
                                </div>

                                {deposits.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--spacing-10) 0' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-4)', opacity: 0.1 }}>🧾</div>
                                        <p className="dashboard-subtitle">No funding history found.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                        {deposits.slice(0, 8).map((d) => (
                                            <div key={d._id} style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                padding: 'var(--spacing-3) var(--spacing-4)', 
                                                borderRadius: 'var(--radius-sm)', 
                                                background: '#F8FAFC',
                                                border: '1px solid var(--color-border)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid var(--color-border)' }}>
                                                        {assets.find(a => a.symbol === d.assetType)?.icon || '💰'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', fontSize: 'var(--font-size-sm)' }}>{d.assetType}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '700', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>${d.amount.toLocaleString()}</div>
                                                    <span className={`status-badge status-${d.status}`} style={{ fontSize: '9px', padding: '0.1rem 0.4rem' }}>{d.status}</span>
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
