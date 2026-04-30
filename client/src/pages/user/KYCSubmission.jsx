import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const KYCSubmission = () => {
    const [kycData, setKycData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        idType: 'ID Card',
        idNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchKycStatus = async () => {
        try {
            setLoading(true);
            const res = await api.get('/kyc/me');
            setKycData(res.data);
        } catch (err) {
            console.error('Failed to fetch KYC status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycStatus();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/kyc', formData);
            setSuccess('KYC documents submitted successfully! Our team will review them shortly.');
            fetchKycStatus();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit KYC');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <DashboardLayout><div className="loading-screen"><div className="loading-spinner"></div></div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '500', color: 'var(--color-primary)' }}>Identity Verification</h1>
                    <p className="dashboard-subtitle">Complete your KYC to unlock all platform features and higher limits.</p>
                </div>

                {kycData ? (
                    <div className="dash-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                            {kycData.status === 'approved' ? (
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                            ) : kycData.status === 'rejected' ? (
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </div>
                            ) : (
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                            {kycData.status === 'approved' ? 'Verification Complete' : 
                             kycData.status === 'rejected' ? 'Verification Rejected' : 
                             'Verification Pending'}
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            {kycData.status === 'approved' ? 'Your identity has been verified. You now have full access to Cradera.' : 
                             kycData.status === 'rejected' ? `Unfortunately, your verification was rejected: ${kycData.rejectionReason}. Please try again.` : 
                             'We are currently reviewing your documents. This usually takes 24-48 hours.'}
                        </p>

                        <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#9CA3AF' }}>ID TYPE</label>
                                    <p style={{ fontWeight: '500' }}>{kycData.idType}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#9CA3AF' }}>ID NUMBER</label>
                                    <p style={{ fontWeight: '500' }}>{kycData.idNumber}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#9CA3AF' }}>SUBMITTED ON</label>
                                    <p style={{ fontWeight: '500' }}>{new Date(kycData.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {kycData.status === 'rejected' && (
                            <button 
                                onClick={() => setKycData(null)} 
                                className="btn btn-primary" 
                                style={{ marginTop: '2rem', padding: '0.8rem 2rem' }}
                            >
                                Re-submit KYC
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="dash-card" style={{ padding: '3rem' }}>
                        <form onSubmit={handleSubmit}>
                            {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
                            {success && <div className="auth-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>ID Document Type</label>
                                    <select 
                                        name="idType" 
                                        value={formData.idType} 
                                        onChange={handleChange} 
                                        required 
                                        style={{ padding: '0.85rem 1rem', borderRadius: '10px', outline: 'none', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
                                    >
                                        <option value="ID Card">National ID Card</option>
                                        <option value="Passport">International Passport</option>
                                        <option value="Drivers License">Driver's License</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: '500', marginBottom: '0.5rem' }}>ID Number</label>
                                    <input 
                                        type="text" 
                                        name="idNumber" 
                                        value={formData.idNumber} 
                                        onChange={handleChange} 
                                        placeholder="Enter ID number" 
                                        required 
                                        style={{ padding: '0.85rem 1rem', borderRadius: '10px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '1rem' }}>Upload ID Document (Front)</label>
                                <div style={{ 
                                    background: '#F9FAFB',
                                    borderRadius: '16px', 
                                    padding: '3rem', 
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px dashed var(--color-border)'
                                }}>
                                    <div style={{ marginBottom: '1rem', color: 'var(--color-primary)', opacity: 0.5 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                                        </svg>
                                    </div>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Click to upload or drag and drop</p>
                                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.5rem' }}>JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={submitting} 
                                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: '500', borderRadius: '12px' }}
                            >
                                {submitting ? 'Submitting Documents...' : 'Submit for Verification'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default KYCSubmission;
