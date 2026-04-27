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
            console.log('Submitting asset data:', formData);
            if (editingAsset) {
                await api.patch(`/assets/${editingAsset._id}`, formData);
            } else {
                await api.post('/assets', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchAssets();
        } catch (err) {
            console.error('Asset operation failed:', err);
            alert(err.response?.data?.error || 'Operation failed. Check console for details.');
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

                {/* Refined Modal Overlay */}
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
                        <div className="dash-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                                    {editingAsset ? 'Modify Asset' : 'Create New Asset'}
                                </h2>
                                <p style={{ color: 'var(--color-text-secondary)' }}>Fill in the details below to configure the deposit asset.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', marginBottom: '0.6rem' }}>Asset Name</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Tether" required style={{ padding: '0.85rem 1rem', borderRadius: '12px' }} />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', marginBottom: '0.6rem' }}>Symbol (Uppercase)</label>
                                        <input name="symbol" value={formData.symbol} onChange={handleInputChange} placeholder="e.g. USDT" required style={{ padding: '0.85rem 1rem', borderRadius: '12px' }} />
                                    </div>
                                </div>
                                
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.6rem' }}>Display Icon (Emoji)</label>
                                    <input name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g. 💰" style={{ padding: '0.85rem 1rem', borderRadius: '12px', width: '100%' }} />
                                </div>

                                <div style={{ marginBottom: '2.5rem', background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h4 style={{ margin: 0, fontWeight: '700', color: 'var(--color-primary)' }}>Networks & Addresses</h4>
                                        <button type="button" onClick={addNetwork} className="btn btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                                            + Add Network
                                        </button>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {formData.networks.map((net, index) => (
                                            <div key={index} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginBottom: '0.5rem' }}>
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.6 }}>NETWORK</label>
                                                        <input value={net.name} onChange={(e) => handleNetworkChange(index, 'name', e.target.value)} placeholder="TRC20" required style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }} />
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.6 }}>DEPOSIT ADDRESS</label>
                                                        <input value={net.address} onChange={(e) => handleNetworkChange(index, 'address', e.target.value)} placeholder="Wallet Address" required style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }} />
                                                    </div>
                                                </div>
                                                {formData.networks.length > 1 && (
                                                    <button type="button" onClick={() => removeNetwork(index)} style={{ color: 'var(--color-danger)', background: 'none', border: 'none', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700', marginTop: '0.5rem' }}>REMOVE NETWORK</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: '700' }}>
                                        {editingAsset ? 'Save Asset Changes' : 'Create Asset Now'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontSize: '1rem', fontWeight: '700' }} onClick={() => setIsModalOpen(false)}>
                                        Discard
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
