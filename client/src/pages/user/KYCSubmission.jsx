import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Webcam from 'react-webcam';

const KYCSubmission = () => {
    const { user } = useAuth();
    const [kycData, setKycData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        idType: 'ID Card',
        idNumber: '',
        idFrontImage: '',
        selfieImage: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);

    const webcamRef = useRef(null);

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

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError('Failed to process image');
        }
    };

    const captureSelfie = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setFormData(prev => ({ ...prev, selfieImage: imageSrc }));
        setIsCameraActive(false);
    }, [webcamRef]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!formData.idFrontImage) return setError('Please upload your ID front image');
        if (!formData.selfieImage) return setError('Please capture or upload a selfie');

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/kyc', formData);
            setSuccess('KYC documents submitted successfully! Our team will review them shortly.');
            setStep(4); // Success state
            fetchKycStatus();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit KYC');
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!user?.phoneNumber || !user?.country)) {
            return setError('Please ensure your profile information (Phone & Country) is complete in Settings.');
        }
        if (step === 2 && !formData.idNumber) {
            return setError('Please enter your ID number');
        }
        setError('');
        setStep(step + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    if (loading) return <DashboardLayout><div className="loading-screen"><div className="loading-spinner"></div></div></DashboardLayout>;

    const renderStepIndicator = () => (
        <div className="kyc-steps" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative', padding: '0 1rem' }}>
            <div style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', height: '2px', background: '#E5E7EB', zIndex: '0' }}></div>
            <div style={{ position: 'absolute', top: '15px', left: '20px', width: `${((step - 1) / 2) * 85}%`, height: '2px', background: 'var(--color-primary)', zIndex: '0', transition: 'width 0.3s ease' }}></div>
            {[1, 2, 3].map((s) => (
                <div key={s} style={{ zIndex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                    <div style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        background: step >= s ? 'var(--color-primary)' : 'white',
                        border: step >= s ? 'none' : '2px solid #E5E7EB',
                        color: step >= s ? 'white' : '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s ease'
                    }}>
                        {step > s ? '✓' : s}
                    </div>
                    <span className="step-label" style={{ fontSize: '0.65rem', marginTop: '0.5rem', fontWeight: '400', color: step >= s ? 'var(--color-primary)' : '#9CA3AF', textAlign: 'center' }}>
                        {s === 1 ? 'Profile' : s === 2 ? 'Document' : 'Identity'}
                    </span>
                </div>
            ))}
        </div>
    );

    if (kycData && step < 4) {
        return (
            <DashboardLayout>
                <div className="dashboard-content fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '500', color: 'var(--color-primary)' }}>KYC Status</h1>
                    </div>
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
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '400', color: 'var(--color-primary)' }}>Identity Verification</h1>
                    <p className="dashboard-subtitle">Complete your KYC to unlock all platform features and higher limits.</p>
                </div>

                {renderStepIndicator()}

                <div className="dash-card kyc-card" style={{ padding: '2rem' }}>
                    {error && <div className="auth-error" style={{ marginBottom: '2rem' }}>{error}</div>}

                    {step === 1 && (
                        <div className="fade-in">
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: '500' }}>Step 1: Personal Information</h3>
                            
                            {(!user?.phoneNumber || !user?.country) && (
                                <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ color: '#EA580C' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.85rem', color: '#9A3412', margin: 0, fontWeight: '500' }}>Profile Incomplete</p>
                                        <p style={{ fontSize: '0.8rem', color: '#C2410C', margin: '0.25rem 0 0 0' }}>Please update your phone number and country in settings to continue.</p>
                                    </div>
                                    <Link to="/dashboard/settings?tab=profile" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Go to Settings</Link>
                                </div>
                            )}

                            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9CA3AF' }}>USERNAME</label>
                                    <p style={{ fontWeight: '400', marginTop: '0.25rem', fontSize: '0.9rem' }}>@{user?.username}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9CA3AF' }}>EMAIL</label>
                                    <p style={{ fontWeight: '400', marginTop: '0.25rem', fontSize: '0.9rem' }}>{user?.email}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9CA3AF' }}>PHONE NUMBER</label>
                                    <p style={{ fontWeight: '400', marginTop: '0.25rem', fontSize: '0.9rem', color: user?.phoneNumber ? 'inherit' : '#EF4444' }}>
                                        {user?.phoneNumber || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '400', color: '#9CA3AF' }}>COUNTRY</label>
                                    <p style={{ fontWeight: '400', marginTop: '0.25rem', fontSize: '0.9rem', color: user?.country ? 'inherit' : '#EF4444' }}>
                                        {user?.country || 'Not set'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={nextStep} className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}>
                                Next Step: Document Selection
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="fade-in">
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: '500' }}>Step 2: Document Selection</h3>
                            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div className="form-group">
                                    <label style={{ fontWeight: '400', marginBottom: '0.5rem', fontSize: '0.85rem' }}>ID Document Type</label>
                                    <select 
                                        name="idType" 
                                        value={formData.idType} 
                                        onChange={handleChange} 
                                        required 
                                        style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: '#F9FAFB', border: '1px solid var(--color-border)', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                                    >
                                        <option value="ID Card">National ID Card</option>
                                        <option value="Passport">International Passport</option>
                                        <option value="Drivers License">Driver's License</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: '400', marginBottom: '0.5rem', fontSize: '0.85rem' }}>ID Number</label>
                                    <input 
                                        type="text" 
                                        name="idNumber" 
                                        value={formData.idNumber} 
                                        onChange={handleChange} 
                                        placeholder="Enter ID number" 
                                        required 
                                        style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: '#F9FAFB', border: '1px solid var(--color-border)', width: '100%', outline: 'none', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={prevStep} className="btn btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>Back</button>
                                <button onClick={nextStep} className="btn btn-primary" style={{ flex: 2, padding: '1rem', borderRadius: '12px' }}>Next Step: Verification</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="fade-in">
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: '500' }}>Step 3: Identity Verification</h3>
                            
                            {/* ID Front Upload */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '1rem', fontSize: '0.9rem' }}>Upload ID Document (Front)</label>
                                <div style={{ 
                                    background: formData.idFrontImage ? 'white' : '#F9FAFB',
                                    borderRadius: '16px', 
                                    padding: formData.idFrontImage ? '1rem' : '3rem', 
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: '2px dashed var(--color-border)',
                                    position: 'relative'
                                }}>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'idFrontImage')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                    {formData.idFrontImage ? (
                                        <img src={formData.idFrontImage} alt="ID Front" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                    ) : (
                                        <>
                                            <div style={{ marginBottom: '1rem', color: 'var(--color-primary)', opacity: 0.5 }}>
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                                                </svg>
                                            </div>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Click to upload ID photo</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Selfie Capture */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontWeight: '500', marginBottom: '1rem', fontSize: '0.9rem' }}>Live Selfie Capture</label>
                                {isCameraActive ? (
                                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: 'black' }}>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                        <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                            <button onClick={captureSelfie} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', background: '#5170ff' }}>Take Photo</button>
                                            <button onClick={() => setIsCameraActive(false)} className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', background: 'white' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ 
                                        background: formData.selfieImage ? 'white' : '#F9FAFB',
                                        borderRadius: '16px', 
                                        padding: formData.selfieImage ? '1rem' : '2.5rem', 
                                        textAlign: 'center',
                                        border: '2px dashed var(--color-border)',
                                        position: 'relative'
                                    }}>
                                        {formData.selfieImage ? (
                                            <img src={formData.selfieImage} alt="Selfie" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} />
                                        ) : (
                                            <div style={{ marginBottom: '1rem', color: 'var(--color-primary)', opacity: 0.5 }}>
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                                </svg>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                            <button onClick={() => setIsCameraActive(true)} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
                                                {formData.selfieImage ? 'Retake Selfie' : 'Use Camera'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={prevStep} className="btn btn-secondary" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>Back</button>
                                <button 
                                    onClick={handleSubmit} 
                                    className="btn btn-primary" 
                                    disabled={submitting || !formData.idFrontImage || !formData.selfieImage} 
                                    style={{ flex: 2, padding: '1rem', borderRadius: '12px' }}
                                >
                                    {submitting ? 'Submitting...' : 'Complete Verification'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Your data is securely encrypted and used solely for identity verification purposes.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default KYCSubmission;
