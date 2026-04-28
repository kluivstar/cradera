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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-8)' }}>
                    <div>
                        <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-1)' }}>Asset Management</h1>
                        <p className="dashboard-subtitle">Configure the assets and networks available for user deposits.</p>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }}
                    >
                        + ADD NEW ASSET
                    </button>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div><p className="dashboard-subtitle">Fetching assets...</p></div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="data-table">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supported Networks</th>
                                    <th style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-4)', opacity: 0.1 }}>💰</div>
                                            <p className="dashboard-subtitle">No assets configured yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map((asset) => (
                                        <tr key={asset._id}>
                                            <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-lg)' }}>
                                                        {asset.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)' }}>{asset.name}</div>
                                                        <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '700' }}>{asset.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                                                    {asset.networks.map((n, i) => (
                                                        <span key={i} className="status-badge" style={{ background: 'white', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '9px', fontWeight: '700', padding: '0.15rem 0.4rem' }}>
                                                            {n.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${asset.isActive ? 'confirmed' : 'pending'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '9px' }}>
                                                    {asset.isActive ? 'ACTIVE' : 'DISABLED'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: 'var(--spacing-4)' }}>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEdit(asset)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '10px', background: '#F1F5F9', border: '1px solid var(--color-border)' }}>EDIT</button>
                                                    <button onClick={() => toggleStatus(asset)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '10px', background: '#F1F5F9', border: '1px solid var(--color-border)' }}>
                                                        {asset.isActive ? 'DISABLE' : 'ENABLE'}
                                                    </button>
                                                    <button onClick={() => handleDelete(asset._id)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '10px', background: '#FEF2F2', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>DELETE</button>
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
                        background: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1.5rem'
                    }}>
                        <div className="dash-card" style={{ 
                            width: '100%', 
                            maxWidth: '500px', 
                            maxHeight: '90vh', 
                            overflowY: 'auto', 
                            padding: 'var(--spacing-6)', 
                            borderRadius: 'var(--radius-md)', 
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ marginBottom: 'var(--spacing-6)' }}>
                                <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-1)' }}>
                                    {editingAsset ? 'Modify Asset' : 'Add New Asset'}
                                </h2>
                                <p className="dashboard-subtitle">Configure asset parameters and networks.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                                    <div className="form-group">
                                        <label style={{ fontSize: '10px', fontWeight: '700', marginBottom: 'var(--spacing-1)' }}>Asset Name</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Tether" required style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '10px', fontWeight: '700', marginBottom: 'var(--spacing-1)' }}>Symbol</label>
                                        <input name="symbol" value={formData.symbol} onChange={handleInputChange} placeholder="e.g. USDT" required style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }} />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
                                    <label style={{ fontSize: '10px', fontWeight: '700', marginBottom: 'var(--spacing-1)' }}>Display Icon (Emoji)</label>
                                    <input name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. 💰" style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', width: '100%' }} />
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                                    <h4 style={{ fontSize: '11px', marginBottom: 'var(--spacing-4)', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network Details</h4>
                                    
                                    {formData.networks.map((net, index) => (
                                        <div key={index} style={{ marginBottom: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--spacing-3)' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '10px', fontWeight: '700' }}>Network {index > 0 ? `#${index + 1}` : ''}</label>
                                                    <input value={net.name} onChange={(e) => handleNetworkChange(index, 'name', e.target.value)} placeholder="e.g. TRC20" required style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }} />
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '10px', fontWeight: '700' }}>Deposit Address</label>
                                                    <input value={net.address} onChange={(e) => handleNetworkChange(index, 'address', e.target.value)} placeholder="Wallet Address" required style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)' }} />
                                                </div>
                                            </div>
                                            {formData.networks.length > 1 && (
                                                <button type="button" onClick={() => removeNetwork(index)} style={{ color: 'var(--color-danger)', border: 'none', background: 'none', fontSize: '10px', fontWeight: '700', textAlign: 'left', width: 'fit-content', cursor: 'pointer' }}>REMOVE NETWORK</button>
                                            )}
                                        </div>
                                    ))}

                                    <button type="button" onClick={addNetwork} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: '700', fontSize: '10px', cursor: 'pointer', marginBottom: 'var(--spacing-6)' }}>
                                        + ADD ANOTHER NETWORK
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-2)' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', fontWeight: '700' }}>
                                        {editingAsset ? 'UPDATE ASSET' : 'CREATE ASSET'}
                                    </button>
                                    <button type="button" className="btn" style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-xs)', fontWeight: '700', background: '#F1F5F9', border: '1px solid var(--color-border)' }} onClick={() => setIsModalOpen(false)}>
                                        CANCEL
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
            </div>
        </DashboardLayout>
    );
};

export default ManageAssets;
