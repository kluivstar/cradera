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
            <div className="dashboard-content fade-in" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', paddingBottom: '5rem' }}>
                <div className="sell-crypto-grid">
                    
                    {/* LEFT COLUMN: ASSET LIST SIDEBAR */}
                    <div className="asset-list-container">
                        {assets.map(asset => (
                            <div 
                                key={asset._id} 
                                onClick={() => handleAssetSelect(asset)}
                                className={`fintech-card ${selectedAsset?._id === asset._id ? 'asset-card-active' : ''}`}
                                style={{ 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1.25rem'
                                }}
                            >
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: '#F3F4F6', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {asset.icon ? (
                                        <img src={asset.icon} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ color: selectedAsset?._id === asset._id ? 'var(--color-primary)' : '#9CA3AF' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--color-primary)' }}>Sell {asset.name}</div>
                                </div>
                                {asset.supportedNetworks?.length > 1 && (
                                    <div style={{ color: '#9CA3AF' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CENTER COLUMN: WALLET DETAILS */}
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                            {selectedAsset?.symbol || 'BTC'} Wallet Details
                        </h2>

                        <div className="fintech-card" style={{ padding: '2rem' }}>
                            {selectedAsset && (
                                <>
                                    <div className="alert-banner alert-warning">
                                        You can ONLY receive {selectedAsset.symbol} with the QR code or address above. It will be automatically converted and added to your NAIRA wallet.
                                    </div>

                                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Send to address</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                        <div className="wallet-address-box" style={{ flex: 1 }}>
                                            <code style={{ fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: '500', letterSpacing: '0.02em' }}>
                                                {selectedNetwork?.walletAddress?.substring(0, 20)}...{selectedNetwork?.walletAddress?.substring(selectedNetwork?.walletAddress?.length - 10)}
                                            </code>
                                            <button 
                                                onClick={() => copyToClipboard(selectedNetwork?.walletAddress)}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div style={{ width: '64px', height: '64px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '4px' }}>
                                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M7 7h.01M17 7h.01M7 17h.01"/>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="alert-banner alert-danger" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                        Please do not send less than 0.00001 {selectedAsset.symbol}.
                                    </div>
                                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                                            See Fee Breakdown <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}><polyline points="6 9 12 15 18 9"/></svg>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem' }}>
                                        <div className="form-grid-2col">
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Amount Sent ($)</label>
                                                <input 
                                                    type="number" name="amount" value={formData.amount} onChange={handleChange} 
                                                    placeholder="0.00" required 
                                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid #F3F4F6', background: '#F9FAFB', outline: 'none' }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Sending Address</label>
                                                <input 
                                                    type="text" name="fromAddress" value={formData.fromAddress} onChange={handleChange} 
                                                    placeholder="Your wallet address" required 
                                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid #F3F4F6', background: '#F9FAFB', outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.35rem', display: 'block' }}>Transaction Hash / TXID</label>
                                            <input 
                                                type="text" name="txHash" value={formData.txHash} onChange={handleChange} 
                                                placeholder="Paste the transaction ID" required 
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid #F3F4F6', background: '#F9FAFB', outline: 'none' }}
                                            />
                                        </div>
                                        <button 
                                            type="submit" disabled={submitting} 
                                            style={{ width: '100%', padding: '1rem', borderRadius: '14px', background: 'var(--color-primary)', color: '#FFFFFF', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                                        >
                                            {submitting ? 'Processing...' : 'I have made the payment'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default SellCrypto;
