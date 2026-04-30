import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { AssetCard, WalletDetails } from '../../components/user/SellCryptoComponents';

const SellCrypto = () => {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        txHash: '',
        fromAddress: ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);
                const res = await api.get('/assets/active');
                setAssets(res.data);
                if (res.data.length > 0) {
                    const firstAsset = res.data[0];
                    setSelectedAsset(firstAsset);
                    if (firstAsset.supportedNetworks?.length > 0) {
                        setSelectedNetwork(firstAsset.supportedNetworks[0]);
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
        setSuccess('');
        setError('');
    };

    const handleNetworkSelect = (asset, network) => {
        setSelectedAsset(asset);
        setSelectedNetwork(network);
        setSuccess('');
        setError('');
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
            setSuccess('Your transaction has been submitted for processing!');
            setFormData({ amount: '', txHash: '', fromAddress: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit transaction');
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) return (
        <DashboardLayout>
            <div className="loading-screen"><div className="loading-spinner"></div></div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
                <div className="sell-crypto-grid" style={{ gridTemplateColumns: '320px 480px', justifyContent: 'flex-start', gap: '3rem' }}>
                    
                    {/* LEFT COLUMN: ASSET LIST SIDEBAR */}
                    <div className="asset-list-container">
                        <h3 style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', letterSpacing: '0.05em', textAlign: 'left' }}>SELECT ASSET TO SELL</h3>
                        {assets.map(asset => (
                            <AssetCard 
                                key={asset._id}
                                asset={asset}
                                isSelected={selectedAsset?._id === asset._id}
                                selectedNetwork={selectedNetwork}
                                onSelect={handleAssetSelect}
                                onNetworkSelect={handleNetworkSelect}
                            />
                        ))}
                    </div>

                    {/* CENTER COLUMN: WALLET DETAILS */}
                    <div style={{ flex: 1 }}>
                        {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1rem', textAlign: 'left' }}>{error}</div>}
                        {success && <div className="alert-banner" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '1rem', textAlign: 'left' }}>{success}</div>}
                        
                        <WalletDetails 
                            asset={selectedAsset}
                            network={selectedNetwork}
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            submitting={submitting}
                            copyToClipboard={copyToClipboard}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SellCrypto;
