import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';

const ManageKYC = () => {
    const [kycRequests, setKycRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKYC, setSelectedKYC] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchKYC = async () => {
        try {
            setLoading(true);
            const res = await api.get('/kyc/admin');
            setKycRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch KYC requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKYC();
    }, []);

    const handleVerify = async (id, status) => {
        if (status === 'rejected' && !rejectionReason) {
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            await api.patch(`/kyc/${id}/verify`, { status, rejectionReason });
            setIsModalOpen(false);
            setRejectionReason('');
            fetchKYC();
        } catch (err) {
            alert('Failed to update KYC status');
        }
    };

    const openDetails = (kyc) => {
        setSelectedKYC(kyc);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '600', color: 'var(--color-primary)' }}>KYC Management</h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem' }}>Review and verify user identity documents.</p>
                </div>

                {loading ? (
                    <div className="loading-screen"><div className="loading-spinner"></div></div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Full Name</th>
                                    <th>ID Type</th>
                                    <th>ID Number</th>
                                    <th>Status</th>
                                    <th>Submitted On</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kycRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>No KYC requests found.</td>
                                    </tr>
                                ) : (
                                    kycRequests.map((kyc) => (
                                        <tr key={kyc._id}>
                                            <td style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}>{kyc.user?.email}</td>
                                            <td style={{ padding: '0.625rem 1rem', fontWeight: '600', fontSize: '0.8125rem' }}>{kyc.fullName}</td>
                                            <td style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}>{kyc.idType}</td>
                                            <td style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}>{kyc.idNumber}</td>
                                            <td style={{ padding: '0.625rem 1rem' }}>
                                                <span className={`status-badge ${
                                                    kyc.status === 'approved' ? 'status-confirmed' : 
                                                    kyc.status === 'rejected' ? 'status-pending' : 
                                                    'status-pending'
                                                }`} style={{ 
                                                    background: kyc.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : undefined,
                                                    color: kyc.status === 'rejected' ? 'var(--color-danger)' : undefined,
                                                    fontSize: '0.65rem'
                                                }}>
                                                    {kyc.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.625rem 1rem', fontSize: '0.8125rem' }}>{new Date(kyc.createdAt).toLocaleDateString()}</td>
                                            <td style={{ textAlign: 'right', padding: '0.625rem 1rem' }}>
                                                <button 
                                                    onClick={() => openDetails(kyc)} 
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '4px' }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* KYC Details Modal */}
                {isModalOpen && selectedKYC && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}>
                        <div className="dash-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: '600' }}>KYC Verification Details</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.625rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '0.25rem', textTransform: 'uppercase' }}>User Email</h4>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{selectedKYC.user?.email}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.625rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Full Legal Name</h4>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{selectedKYC.fullName}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.625rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '0.25rem', textTransform: 'uppercase' }}>ID Type</h4>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{selectedKYC.idType}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.625rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '0.25rem', textTransform: 'uppercase' }}>ID Number</h4>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{selectedKYC.idNumber}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '0.625rem', fontWeight: '600', color: '#9CA3AF', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Document Image (Front)</h4>
                                <img 
                                    src={selectedKYC.idFrontImage} 
                                    alt="ID Front" 
                                    style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            {selectedKYC.status === 'pending' ? (
                                <div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.35rem', fontSize: '0.8125rem' }}>Rejection Reason (only if rejecting)</label>
                                        <textarea 
                                            value={rejectionReason} 
                                            onChange={(e) => setRejectionReason(e.target.value)} 
                                            placeholder="Explain why the documents were rejected..." 
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid var(--color-border)', minHeight: '80px', fontSize: '0.875rem' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button 
                                            onClick={() => handleVerify(selectedKYC._id, 'approved')} 
                                            className="btn btn-primary" 
                                            style={{ flex: 1, padding: '0.625rem', fontSize: '0.875rem' }}
                                        >
                                            Approve Identity
                                        </button>
                                        <button 
                                            onClick={() => handleVerify(selectedKYC._id, 'rejected')} 
                                            className="btn btn-secondary" 
                                            style={{ flex: 1, padding: '0.625rem', fontSize: '0.875rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                                        >
                                            Reject Documents
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ fontWeight: '600', color: selectedKYC.status === 'approved' ? 'var(--color-accent)' : 'var(--color-danger)' }}>
                                        THIS REQUEST WAS {selectedKYC.status.toUpperCase()} ON {new Date(selectedKYC.verifiedAt).toLocaleDateString()}
                                    </p>
                                    {selectedKYC.status === 'rejected' && (
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                            Reason: {selectedKYC.rejectionReason}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageKYC;
