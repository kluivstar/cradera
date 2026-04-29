import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const SellCrypto = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        amount: '',
        txHash: '',
        fromAddress: ''
    });

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);
                const res = await api.get('/assets/active');
                setAssets(res.data);
                if (res.data.length > 0) {
                    setSelectedAsset(res.data[0]);
                    if (res.data[0].supportedNetworks?.length > 0) {
                        setSelectedNetwork(res.data[0].supportedNetworks[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch assets');
                setError('Failed to load available assets.');
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleAssetSelect = (asset) => {
        setSelectedAsset(asset);
        if (asset.supportedNetworks?.length > 0) {
            setSelectedNetwork(asset.supportedNetworks[0]);
        } else {
            setSelectedNetwork(null);
        }
        setError('');
        setSuccess('');
    };

    const handleNetworkChange = (e) => {
        const network = selectedAsset.supportedNetworks.find(n => n.networkName === e.target.value);
        setSelectedNetwork(network);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAsset || !selectedNetwork) return;

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/deposits', {
                ...formData,
                assetType: selectedAsset.symbol,
                network: selectedNetwork.networkName,
                amount: parseFloat(formData.amount)
            });
            setSuccess('Transaction submitted for verification!');
            setFormData({ amount: '', txHash: '', fromAddress: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit transaction');
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="loading-screen"><div className="loading-spinner"></div><p>Loading assets...</p></div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                        Sell Crypto
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>
                        Sell your digital assets and get paid instantly in Naira.
                    </p>
                </div>

                <div className="sell-crypto-grid">
                    {/* LEFT SIDE: ASSET LIST */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>
                            Select Asset
                        </h3>
                        {assets.map(asset => (
                            <div 
                                key={asset._id} 
                                onClick={() => handleAssetSelect(asset)}
                                style={{ 
                                    padding: '0.875rem 1rem', 
                                    borderRadius: '10px', 
                                    background: '#FFFFFF',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.875rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: selectedAsset?._id === asset._id ? '0 10px 25px rgba(11, 34, 83, 0.08)' : '0 2px 10px rgba(0,0,0,0.02)',
                                    transform: selectedAsset?._id === asset._id ? 'translateY(-2px)' : 'none'
                                }}
                            >
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    background: '#F3F4F6', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-primary)'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                    </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-primary)' }}>{asset.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Rate: ₦{asset.currentRate?.toLocaleString()}/$</div>
                                </div>
                                {selectedAsset?._id === asset._id && (
                                    <div style={{ color: 'var(--color-primary)' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE: ASSET DETAILS */}
                    <div className="dash-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
                        {!selectedAsset ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Please select an asset to continue.</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.1rem', fontWeight: '500' }}>Sell {selectedAsset.name}</h2>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Current Rate: <span style={{ color: 'var(--color-primary)', fontWeight: '500' }}>₦{selectedAsset.currentRate?.toLocaleString()}/$</span></p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.5rem' }}>Supported Networks</label>
                                    <select 
                                        value={selectedNetwork?.networkName || ''} 
                                        onChange={handleNetworkChange}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem', fontWeight: '500' }}
                                    >
                                        {selectedAsset.supportedNetworks?.map(n => (
                                            <option key={n.networkName} value={n.networkName}>{n.networkName}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedNetwork ? (
                                    <div style={{ background: '#F9FAFB', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', fontWeight: '500' }}>
                                            {selectedNetwork.networkName} Wallet Address
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <code style={{ fontSize: '0.875rem', wordBreak: 'break-all', color: 'var(--color-primary)', fontWeight: '500', flex: 1 }}>
                                                {selectedNetwork.walletAddress}
                                            </code>
                                            <button 
                                                onClick={() => copyToClipboard(selectedNetwork.walletAddress)}
                                                style={{ background: 'var(--color-primary)', color: '#FFFFFF', border: 'none', padding: '0.4rem 0.875rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer' }}
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        
                                        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ width: '120px', height: '120px', background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E5E7EB' }}>
                                                {/* QR Code Placeholder */}
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M7 7h.01M17 7h.01M7 17h.01"/>
                                                </svg>
                                            </div>
                                        </div>

                                        <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', lineHeight: '1.5' }}>
                                            "You can ONLY receive {selectedAsset.symbol} with the QR code or address above. It will be automatically converted and added to your naira wallet."
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', background: '#FEF2F2', borderRadius: '12px', marginBottom: '2rem' }}>
                                        <p style={{ color: '#DC2626', fontSize: '0.875rem' }}>No networks available for this asset.</p>
                                    </div>
                                )}

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: '500', marginBottom: '1rem', color: 'var(--color-primary)' }}>Deposit Instructions</h3>
                                    <ol style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li>Transfer the amount you wish to sell to the address provided above.</li>
                                        <li>Ensure you use the correct network to avoid loss of funds.</li>
                                        <li>Wait for at least 1-3 network confirmations.</li>
                                        <li>Submit the transaction details below for instant processing.</li>
                                    </ol>
                                </div>

                                <form onSubmit={handleSubmit} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                                    {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                                    {success && <div style={{ background: '#ECFDF5', color: '#059669', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem' }}>Amount Sent ($)</label>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={formData.amount} 
                                                onChange={handleChange} 
                                                placeholder="0.00" 
                                                required 
                                                style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem' }}>Sending Address</label>
                                            <input 
                                                type="text" 
                                                name="fromAddress" 
                                                value={formData.fromAddress} 
                                                onChange={handleChange} 
                                                placeholder="Your wallet address" 
                                                required 
                                                style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem' }}>Transaction Hash / TXID</label>
                                        <input 
                                            type="text" 
                                            name="txHash" 
                                            value={formData.txHash} 
                                            onChange={handleChange} 
                                            placeholder="Paste the transaction ID" 
                                            required 
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '0.875rem' }}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={submitting || !selectedNetwork} 
                                        style={{ 
                                            width: '100%', 
                                            padding: '0.75rem', 
                                            fontSize: '0.875rem', 
                                            fontWeight: '600', 
                                            borderRadius: '8px', 
                                            background: 'var(--color-primary)', 
                                            color: '#FFFFFF', 
                                            border: 'none', 
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s ease'
                                        }}
                                    >
                                        {submitting ? 'Processing...' : 'I have made the payment'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SellCrypto;
