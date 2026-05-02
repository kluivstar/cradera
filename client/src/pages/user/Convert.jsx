import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Convert = () => {
    const [formData, setFormData] = useState({
        fromAsset: 'BTC',
        toAsset: 'NGN',
        amount: ''
    });
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setResult(null);
    };

    const handleConvert = (e) => {
        e.preventDefault();
        setCalculating(true);
        // Simulate calculation
        setTimeout(() => {
            setCalculating(false);
            setResult({
                fromAmount: formData.amount,
                fromAsset: formData.fromAsset,
                toAmount: (formData.amount * 12500000).toLocaleString(), // Dummy rate
                toAsset: formData.toAsset,
                rate: '1 BTC = 12,500,000 NGN'
            });
        }, 1000);
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)' }}>Convert Assets</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Swap between crypto and fiat instantly with competitive rates.</p>
                </div>

                <div className="dash-card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleConvert}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.5rem' }}>From</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select 
                                    name="fromAsset" 
                                    value={formData.fromAsset} 
                                    onChange={handleChange}
                                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontWeight: '500' }}
                                >
                                    <option value="BTC">BTC</option>
                                    <option value="ETH">ETH</option>
                                    <option value="USDT">USDT</option>
                                </select>
                                <input 
                                    type="number" 
                                    name="amount" 
                                    value={formData.amount} 
                                    onChange={handleChange} 
                                    placeholder="0.00" 
                                    required 
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontSize: '1rem', fontWeight: '500' }}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--color-text-secondary)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 10l5 5 5-5"/>
                            </svg>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.5rem' }}>To</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select 
                                    name="toAsset" 
                                    value={formData.toAsset} 
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: '#F9FAFB', fontWeight: '500' }}
                                >
                                    <option value="NGN">NGN (Naira Wallet)</option>
                                    <option value="USD">USD (Vault)</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={calculating}
                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '500' }}
                        >
                            {calculating ? 'Calculating...' : 'Preview Conversion'}
                        </button>
                    </form>

                    {result && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>You will receive approximately</p>
                            <h2 style={{ color: 'var(--color-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>{result.toAmount} {result.toAsset}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>{result.rate}</p>
                            <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: '8px', fontWeight: '500', background: '#5170ff' }}>
                                Confirm Conversion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Convert;
