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
        icon: '💰',
        networks: [{ name: '', address: '' }]
    });

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const res = await api.get('/assets/admin');
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
            icon: '💰',
            networks: [{ name: '', address: '' }]
        });
        setEditingAsset(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNetworkChange = (index, field, value) => {
        const newNetworks = [...formData.networks];
        newNetworks[index] = { ...newNetworks[index], [field]: value };
        setFormData({ ...formData, networks: newNetworks });
    };

    const addNetwork = () => {
        setFormData({
            ...formData,
            networks: [...formData.networks, { name: '', address: '' }]
        });
    };

    const removeNetwork = (index) => {
        const newNetworks = formData.networks.filter((_, i) => i !== index);
        setFormData({ ...formData, networks: newNetworks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAsset) {
                await api.patch(`/assets/${editingAsset._id}`, formData);
            } else {
                await api.post('/assets', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchAssets();
        } catch (err) {
            alert(err.response?.data?.error || 'Operation failed.');
        }
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name,
            symbol: asset.symbol,
            icon: asset.icon || '💰',
            networks: asset.networks.length > 0 ? [...asset.networks] : [{ name: '', address: '' }]
        });
        setIsModalOpen(true);
    };

    const toggleStatus = async (asset) => {
        try {
            await api.patch(`/assets/${asset._id}`, { isActive: !asset.isActive });
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
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Configure the assets and networks available for user deposits.</p>
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
                    <div className="table-wrapper" style={{ border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', borderRadius: '16px' }}>
                        <table className="data-table">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem 1.25rem' }}>Asset</th>
                                    <th>Supported Networks</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right', paddingRight: '1.25rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '5rem' }}>
                                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', opacity: 0.1 }}>
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                                                </svg>
                                            </div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>No assets configured yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map((asset) => (
                                        <tr key={asset._id}>
                                            <td style={{ padding: '0.75rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                        {asset.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500', color: 'var(--color-primary)', fontSize: '0.9rem' }}>{asset.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{asset.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                    {asset.networks.map((n, i) => (
                                                        <span key={i} className="status-badge" style={{ background: 'white', color: 'var(--color-text-primary)', fontSize: '0.65rem', fontWeight: '500', padding: '0.25rem 0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                                            {n.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${asset.isActive ? 'status-confirmed' : 'status-pending'}`} style={{ padding: '0.25rem 0.625rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '500' }}>
                                                    {asset.isActive ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '1.25rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEdit(asset)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', borderRadius: '4px' }}>Edit</button>
                                                    <button onClick={() => toggleStatus(asset)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', borderRadius: '4px' }}>
                                                        {asset.isActive ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button onClick={() => handleDelete(asset._id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: '500', borderRadius: '4px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Unified Flat Modal Overlay */}
                {isModalOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1.5rem'
                    }}>
                        <div style={{ 
                            background: 'white',
                            width: '100%', 
                            maxWidth: '500px', 
                            maxHeight: '90vh', 
                            overflowY: 'auto', 
                            padding: '1.5rem', 
                            borderRadius: '16px', 
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                                    {editingAsset ? 'Modify Asset' : 'Add New Asset'}
                                </h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Fill in the details below to configure the asset.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Asset Name</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Tether" required style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Symbol</label>
                                        <input name="symbol" value={formData.symbol} onChange={handleInputChange} placeholder="e.g. USDT" required style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem' }} />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: '500', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Display Icon (Emoji)</label>
                                    <input name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. 💰" style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', width: '100%', fontSize: '0.875rem' }} />
                                    <div style={{ borderTop: '1px solid var(--color-border)', pt: '1rem', marginTop: '1rem' }}>
                                        <h4 style={{ margin: '1rem 0', color: 'var(--color-primary)', fontWeight: '500', fontSize: '0.9rem' }}>Network Details</h4>
                                        
                                        {formData.networks.map((net, index) => (
                                            <div key={index} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.75rem', fontWeight: '500' }}>Network {index > 0 ? `#${index + 1}` : ''}</label>
                                                        <input value={net.name} onChange={(e) => handleNetworkChange(index, 'name', e.target.value)} placeholder="e.g. TRC20" required style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem' }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.75rem', fontWeight: '500' }}>Deposit Address</label>
                                                        <input value={net.address} onChange={(e) => handleNetworkChange(index, 'address', e.target.value)} placeholder="Wallet Address" required style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem' }} />
                                                    </div>
                                                </div>
                                                {formData.networks.length > 1 && (
                                                    <button type="button" onClick={() => removeNetwork(index)} style={{ color: 'var(--color-danger)', border: 'none', background: 'none', fontSize: '0.7rem', fontWeight: '500', textAlign: 'left', width: 'fit-content', cursor: 'pointer' }}>Remove</button>
                                                )}
                                            </div>
                                        ))}
                                        
                                        <button type="button" onClick={addNetwork} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '500', fontSize: '0.8125rem', cursor: 'pointer', marginBottom: '1rem' }}>
                                            + Add Another Network
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500' }}>
                                        {editingAsset ? 'Update Asset' : 'Create Asset'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500' }} onClick={() => setIsModalOpen(false)}>
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
