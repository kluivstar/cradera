import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        currentRate: '',
        active: true,
        supportedNetworks: [{ networkName: '', walletAddress: '', active: true }]
    });

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const res = await api.get('/assets');
            setAssets(res.data);
        } catch (err) {
            console.error('Failed to fetch assets', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            symbol: '',
            currentRate: '',
            active: true,
            supportedNetworks: [{ networkName: '', walletAddress: '', active: true }]
        });
        setEditingAsset(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleNetworkChange = (index, field, value) => {
        const newNetworks = [...formData.supportedNetworks];
        newNetworks[index] = { 
            ...newNetworks[index], 
            [field]: field === 'active' ? value : value 
        };
        setFormData({ ...formData, supportedNetworks: newNetworks });
    };

    const addNetwork = () => {
        setFormData({
            ...formData,
            supportedNetworks: [...formData.supportedNetworks, { networkName: '', walletAddress: '', active: true }]
        });
    };

    const removeNetwork = (index) => {
        const newNetworks = formData.supportedNetworks.filter((_, i) => i !== index);
        setFormData({ ...formData, supportedNetworks: newNetworks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                symbol: formData.symbol.toUpperCase(),
                currentRate: parseFloat(formData.currentRate)
            };
            
            let response;
            if (editingAsset) {
                response = await api.patch(`/assets/${editingAsset._id}`, data);
            } else {
                response = await api.post('/assets', data);
            }
            
            console.log('Asset operation successful:', response.data);
            setIsModalOpen(false);
            resetForm();
            
            // Re-fetch immediately to sync with backend
            await fetchAssets();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed.');
        }
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name,
            symbol: asset.symbol,
            currentRate: asset.currentRate || '',
            active: asset.active !== undefined ? asset.active : true,
            supportedNetworks: asset.supportedNetworks?.length > 0 
                ? asset.supportedNetworks.map(n => ({ ...n })) 
                : [{ networkName: '', walletAddress: '', active: true }]
        });
        setIsModalOpen(true);
    };

    const toggleStatus = async (asset) => {
        try {
            await api.patch(`/assets/${asset._id}`, { active: !asset.active });
            fetchAssets();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this asset?')) return;
        try {
            await api.delete(`/assets/${id}`);
            fetchAssets();
        } catch (err) {
            alert('Failed to delete asset');
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Asset Management</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Configure trading assets, exchange rates, and wallet networks.</p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem' }}
                    >
                        + Add Asset
                    </button>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div><p>Fetching assets...</p></div>
                ) : (
                    <div className="dash-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '1rem 1.25rem' }}>Asset</th>
                                        <th>Symbol</th>
                                        <th>Exchange Rate</th>
                                        <th>Networks</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '5rem' }}>
                                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>No assets configured yet.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        assets.map((asset) => (
                                            <tr key={asset._id}>
                                                <td style={{ padding: '0.875rem 1.25rem' }}>
                                                    <div style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{asset.name}</div>
                                                </td>
                                                <td style={{ fontWeight: '500', fontSize: '0.8125rem' }}>{asset.symbol}</td>
                                                <td style={{ fontWeight: '500', color: 'var(--color-primary)' }}>₦{asset.currentRate?.toLocaleString()} / $</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                        {asset.supportedNetworks?.map((n, i) => (
                                                            <span key={i} style={{ 
                                                                fontSize: '0.65rem', 
                                                                padding: '0.15rem 0.45rem', 
                                                                background: n.active ? '#F3F4F6' : '#FEE2E2', 
                                                                color: n.active ? '#374151' : '#B91C1C',
                                                                borderRadius: '4px',
                                                                fontWeight: '500'
                                                            }}>
                                                                {n.networkName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ 
                                                        fontSize: '0.65rem', 
                                                        padding: '0.25rem 0.6rem', 
                                                        borderRadius: '6px',
                                                        fontWeight: '600',
                                                        background: asset.active ? '#DEF7EC' : '#F3F4F6',
                                                        color: asset.active ? '#03543F' : '#6B7280'
                                                    }}>
                                                        {asset.active ? 'ACTIVE' : 'DISABLED'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleEdit(asset)} style={{ background: 'none', border: '1px solid var(--color-border)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer' }}>Edit</button>
                                                        <button onClick={() => toggleStatus(asset)} style={{ background: 'none', border: '1px solid var(--color-border)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer' }}>
                                                            {asset.active ? 'Disable' : 'Enable'}
                                                        </button>
                                                        <button onClick={() => handleDelete(asset._id)} style={{ background: '#FEF2F2', border: 'none', color: '#B91C1C', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer' }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* MODAL */}
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem'
                    }}>
                        <div style={{ 
                            background: 'white', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', 
                            padding: '1.75rem', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' 
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)' }}>
                                    {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                                </h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Configure asset properties and wallet networks.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Asset Name</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Bitcoin" required style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.875rem' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Symbol</label>
                                        <input name="symbol" value={formData.symbol} onChange={handleInputChange} placeholder="e.g. BTC" required style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.875rem' }} />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Current Rate (₦/$)</label>
                                        <input name="currentRate" type="number" value={formData.currentRate} onChange={handleInputChange} placeholder="e.g. 1500" required style={{ padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.875rem' }} />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                                        <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} id="assetActive" />
                                        <label htmlFor="assetActive" style={{ fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>Active Asset</label>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '1rem' }}>Wallet Networks</h4>
                                    
                                    {formData.supportedNetworks.map((net, index) => (
                                        <div key={index} style={{ marginBottom: '1.25rem', padding: '1rem', background: '#F9FAFB', borderRadius: '12px', position: 'relative' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem' }}>Network Name</label>
                                                    <input value={net.networkName} onChange={(e) => handleNetworkChange(index, 'networkName', e.target.value)} placeholder="e.g. ERC20" required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.8125rem' }} />
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem' }}>Wallet Address</label>
                                                    <input value={net.walletAddress} onChange={(e) => handleNetworkChange(index, 'walletAddress', e.target.value)} placeholder="0x..." required style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.8125rem' }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <input type="checkbox" checked={net.active} onChange={(e) => handleNetworkChange(index, 'active', e.target.checked)} id={`netActive-${index}`} />
                                                    <label htmlFor={`netActive-${index}`} style={{ fontSize: '0.75rem', fontWeight: '500' }}>Active Network</label>
                                                </div>
                                                {formData.supportedNetworks.length > 1 && (
                                                    <button type="button" onClick={() => removeNetwork(index)} style={{ color: '#EF4444', border: 'none', background: 'none', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer' }}>Remove Network</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button type="button" onClick={addNetwork} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '500', cursor: 'pointer', width: '100%' }}>
                                        + Add Network
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" style={{ flex: 2, padding: '0.75rem', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                                        {editingAsset ? 'Update Asset Configuration' : 'Create Asset'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', background: 'white', border: '1px solid var(--color-border)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageAssets;
