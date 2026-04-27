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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Asset Management</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>Configure the assets and networks available for user deposits.</p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        style={{ padding: '0.875rem 1.75rem', borderRadius: '12px', fontSize: '1rem' }}
                    >
                        + Add New Asset
                    </button>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div><p>Fetching assets...</p></div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', borderRadius: '16px' }}>
                        <table className="data-table">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th style={{ padding: '1.25rem 2rem' }}>Asset</th>
                                    <th>Supported Networks</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '5rem' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.2 }}>💰</div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>No assets configured yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map((asset) => (
                                        <tr key={asset._id}>
                                            <td style={{ padding: '1.5rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
                                                        {asset.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.1rem' }}>{asset.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>{asset.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                                    {asset.networks.map((n, i) => (
                                                        <span key={i} className="status-badge" style={{ background: 'white', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '0.75rem', fontWeight: '600', padding: '0.35rem 0.75rem' }}>
                                                            {n.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${asset.isActive ? 'status-confirmed' : 'status-pending'}`} style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                                                    {asset.isActive ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEdit(asset)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700' }}>Edit</button>
                                                    <button onClick={() => toggleStatus(asset)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700' }}>
                                                        {asset.isActive ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button onClick={() => handleDelete(asset._id)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.1)' }}>Delete</button>
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
                            maxWidth: '600px', 
                            maxHeight: '90vh', 
                            overflowY: 'auto', 
                            padding: '3rem', 
                            borderRadius: '24px', 
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
                        }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                                    {editingAsset ? 'Modify Asset' : 'Add New Asset'}
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Fill in the details below to configure the asset.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', marginBottom: '0.6rem' }}>Asset Name</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Tether" required style={{ padding: '0.85rem 1rem', borderRadius: '12px' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', marginBottom: '0.6rem' }}>Symbol</label>
                                        <input name="symbol" value={formData.symbol} onChange={handleInputChange} placeholder="e.g. USDT" required style={{ padding: '0.85rem 1rem', borderRadius: '12px' }} />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.6rem' }}>Display Icon (Emoji)</label>
                                    <input name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. 💰" style={{ padding: '0.85rem 1rem', borderRadius: '12px', width: '100%' }} />
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-border)', pt: '1.5rem', marginTop: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: '700' }}>Network Details</h4>
                                    
                                    {formData.networks.map((net, index) => (
                                        <div key={index} style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Network {index > 0 ? `#${index + 1}` : ''}</label>
                                                    <input value={net.name} onChange={(e) => handleNetworkChange(index, 'name', e.target.value)} placeholder="e.g. TRC20" required style={{ padding: '0.85rem 1rem', borderRadius: '12px' }} />
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Deposit Address</label>
                                                    <input value={net.address} onChange={(e) => handleNetworkChange(index, 'address', e.target.value)} placeholder="Wallet Address" required style={{ padding: '0.85rem 1rem', borderRadius: '12px' }} />
                                                </div>
                                            </div>
                                            {formData.networks.length > 1 && (
                                                <button type="button" onClick={() => removeNetwork(index)} style={{ color: 'var(--color-danger)', border: 'none', background: 'none', fontSize: '0.8rem', fontWeight: '700', textAlign: 'left', width: 'fit-content', cursor: 'pointer' }}>Remove Network</button>
                                            )}
                                        </div>
                                    ))}

                                    <button type="button" onClick={addNetwork} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '2rem' }}>
                                        + Add Another Network
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: '700' }}>
                                        {editingAsset ? 'Update Asset' : 'Create Asset'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: '700' }} onClick={() => setIsModalOpen(false)}>
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
