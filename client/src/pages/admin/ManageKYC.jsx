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
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>KYC Management</h1>
                    <p className="dashboard-subtitle">Review and verify user identity documents.</p>
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
                                            <td>{kyc.user?.email}</td>
                                            <td style={{ fontWeight: '600' }}>{kyc.fullName}</td>
                                            <td>{kyc.idType}</td>
                                            <td>{kyc.idNumber}</td>
                                            <td>
                                                <span className={`status-badge ${
                                                    kyc.status === 'approved' ? 'status-confirmed' : 
                                                    kyc.status === 'rejected' ? 'status-pending' : 
                                                    'status-pending'
                                                }`} style={{ 
                                                    background: kyc.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : undefined,
                                                    color: kyc.status === 'rejected' ? 'var(--color-danger)' : undefined
                                                }}>
                                                    {kyc.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{new Date(kyc.createdAt).toLocaleDateString()}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => openDetails(kyc)} 
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                >
                                                    View Details
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
                        <div className="dash-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ color: 'var(--color-primary)' }}>KYC Verification Details</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9CA3AF', marginBottom: '0.5rem' }}>USER EMAIL</h4>
                                    <p style={{ fontWeight: '600' }}>{selectedKYC.user?.email}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9CA3AF', marginBottom: '0.5rem' }}>FULL LEGAL NAME</h4>
                                    <p style={{ fontWeight: '600' }}>{selectedKYC.fullName}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9CA3AF', marginBottom: '0.5rem' }}>ID TYPE</h4>
                                    <p style={{ fontWeight: '600' }}>{selectedKYC.idType}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9CA3AF', marginBottom: '0.5rem' }}>ID NUMBER</h4>
                                    <p style={{ fontWeight: '600' }}>{selectedKYC.idNumber}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9CA3AF', marginBottom: '1rem' }}>DOCUMENT IMAGE (FRONT)</h4>
                                <img 
                                    src={selectedKYC.idFrontImage} 
                                    alt="ID Front" 
                                    style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--color-border)' }}
                                />
                            </div>

                            {selectedKYC.status === 'pending' ? (
                                <div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Rejection Reason (only if rejecting)</label>
                                        <textarea 
                                            value={rejectionReason} 
                                            onChange={(e) => setRejectionReason(e.target.value)} 
                                            placeholder="Explain why the documents were rejected..." 
                                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid var(--color-border)', minHeight: '100px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button 
                                            onClick={() => handleVerify(selectedKYC._id, 'approved')} 
                                            className="btn btn-primary" 
                                            style={{ flex: 1, padding: '0.8rem' }}
                                        >
                                            Approve Identity
                                        </button>
                                        <button 
                                            onClick={() => handleVerify(selectedKYC._id, 'rejected')} 
                                            className="btn btn-secondary" 
                                            style={{ flex: 1, padding: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                                        >
                                            Reject Documents
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                                    <p style={{ fontWeight: '700', color: selectedKYC.status === 'approved' ? 'var(--color-accent)' : 'var(--color-danger)' }}>
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
