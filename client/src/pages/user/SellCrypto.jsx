import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const SellCrypto = () => {
    const [assets, setAssets] = useState([]);
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
            const res = await api.get('/assets');
            setAssets(res.data);
            
            if (res.data.length > 0) {
                const firstAsset = res.data[0];
                handleSelectAsset(firstAsset);
            }
        } catch (err) {
            console.error('Failed to fetch assets');
            setError('Failed to load asset information.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSelectAsset = (asset) => {
        setSelectedAsset(asset);
        setFormData({ 
            ...formData, 
            assetType: asset.symbol, 
            network: asset.networks[0]?.name || '',
            amount: '',
            txHash: '',
            fromAddress: ''
        });
        setError('');
        setSuccess('');
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
            setSuccess('Sell request submitted successfully! Your Naira wallet will be credited once confirmed.');
            setFormData(prev => ({
                ...prev,
                amount: '',
                txHash: '',
                fromAddress: ''
            }));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit request');
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
                <div className="loading-screen"><div className="loading-spinner"></div><p>Fetching market rates...</p></div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                        Sell Crypto
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        Select an asset to sell and get credited instantly in Naira.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '350px 1fr', 
                    gap: '1.5rem',
                    alignItems: 'start'
                }}>
                    {/* Left Side: Asset List */}
                    <div className="dash-card" style={{ padding: '1rem', border: 'none', background: 'white' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '1rem', padding: '0 0.5rem', color: 'var(--color-primary)' }}>Select Asset</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {assets.map((asset) => (
                                <div 
                                    key={asset.symbol}
                                    onClick={() => handleSelectAsset(asset)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        padding: '0.875rem 1rem', 
                                        borderRadius: '12px', 
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        background: selectedAsset?.symbol === asset.symbol ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                                        border: selectedAsset?.symbol === asset.symbol ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                            {asset.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{asset.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{asset.symbol}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--color-primary)' }}>₦{asset.rate?.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Rate per $</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Details & Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {selectedAsset ? (
                            <div className="dash-card" style={{ padding: '2rem', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            {selectedAsset.icon}
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)' }}>Sell {selectedAsset.name}</h2>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Market Rate: <span style={{ fontWeight: '500', color: 'var(--color-primary)' }}>₦{selectedAsset.rate?.toLocaleString()} / $</span></p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Network</label>
                                        <select 
                                            name="network" 
                                            value={formData.network} 
                                            onChange={handleChange} 
                                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.85rem', fontWeight: '500' }}
                                        >
                                            {selectedAsset.networks.map(n => (
                                                <option key={n.name} value={n.name}>{n.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ 
                                    background: 'var(--color-primary)', 
                                    color: 'white', 
                                    padding: '1.5rem', 
                                    borderRadius: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    marginBottom: '2rem'
                                }}>
                                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', color: 'white', opacity: 0.05 }}>
                                        <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                        </svg>
                                    </div>
                                    <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', opacity: 0.7, fontWeight: '500' }}>
                                        Your Destination {selectedAsset.symbol} Address
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                                        <code style={{ fontSize: '1rem', wordBreak: 'break-all', fontWeight: '500', flex: 1, letterSpacing: '0.02em', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
                                            {getWalletAddress()}
                                        </code>
                                        <button 
                                            onClick={copyToClipboard}
                                            style={{ 
                                                background: 'var(--color-accent)', 
                                                color: 'var(--color-primary)', 
                                                border: 'none', 
                                                padding: '0.75rem 1.25rem', 
                                                borderRadius: '10px', 
                                                fontSize: '0.85rem', 
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', display: 'flex', gap: '0.5rem', lineHeight: '1.5' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                                            </svg>
                                            <span>
                                                You can <strong>ONLY</strong> receive {selectedAsset.symbol} with the QR code or address above. It will be automatically converted and added to your naira wallet.
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                                        {success && <div style={{ background: '#ECFDF5', color: '#059669', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #10B98133' }}>{success}</div>}
                                    </div>
                                    
                                    <div className="form-group">
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
                                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 1.875rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.95rem', fontWeight: '500' }}
                                            />
                                        </div>
                                        {formData.amount && (
                                            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#10B981', fontWeight: '500' }}>
                                                ≈ ₦{(parseFloat(formData.amount) * selectedAsset.rate).toLocaleString()} Naira
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Transaction Hash (TXID)</label>
                                        <input 
                                            type="text" 
                                            name="txHash" 
                                            value={formData.txHash} 
                                            onChange={handleChange} 
                                            placeholder="Paste TXID" 
                                            required 
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Your Sending Wallet Address</label>
                                        <input 
                                            type="text" 
                                            name="fromAddress" 
                                            value={formData.fromAddress} 
                                            onChange={handleChange} 
                                            placeholder="Address you sent from" 
                                            required 
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-accent" 
                                        disabled={submitting} 
                                        style={{ gridColumn: 'span 2', padding: '0.875rem', fontSize: '0.95rem', fontWeight: '500', borderRadius: '12px', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)', marginTop: '0.5rem' }}
                                    >
                                        {submitting ? 'Verifying...' : `Confirm ${selectedAsset.symbol} Payment`}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="dash-card" style={{ padding: '5rem', textAlign: 'center', opacity: 0.5 }}>
                                <p>Select an asset from the list to start.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SellCrypto;
