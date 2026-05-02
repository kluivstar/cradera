import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        asset: '',
        startDate: '',
        endDate: ''
    });

    const fetchAssets = async () => {
        try {
            const res = await api.get('/assets');
            setAssets(res.data);
        } catch (err) {
            console.error('Failed to fetch assets');
        }
    };

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.asset) queryParams.append('asset', filters.asset);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const res = await api.get(`/transactions?${queryParams.toString()}`);
            setTransactions(res.data);
        } catch (err) {
            console.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAssets();
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({ status: '', asset: '', startDate: '', endDate: '' });
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(11, 34, 83);
        doc.text("Transaction Statement", 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        if (filters.startDate || filters.endDate) {
            doc.text(`Period: ${filters.startDate || 'Start'} to ${filters.endDate || 'Present'}`, 14, 35);
        }

        const tableColumn = ["Date", "Type", "Asset", "Amount", "Status", "Details"];
        const tableRows = [];

        transactions.forEach(tx => {
            const rowData = [
                new Date(tx.date).toLocaleDateString(),
                tx.type.toUpperCase().replace('_', ' '),
                tx.asset,
                tx.amount.toLocaleString(),
                tx.status.toUpperCase(),
                tx.details
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [11, 34, 83], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [249, 250, 251] },
        });

        doc.save(`Cradera_Statement_${new Date().getTime()}.pdf`);
    };

    const getStatusStyle = (status) => {
        const s = status.toLowerCase();
        if (['confirmed', 'paid', 'approved', 'completed'].includes(s)) return { background: '#DEF7EC', color: '#03543F' };
        if (['pending', 'processing'].includes(s)) return { background: '#FEF3C7', color: '#92400E' };
        if (['rejected', 'failed'].includes(s)) return { background: '#FDE2E2', color: '#9B1C1C' };
        return { background: '#F3F4F6', color: '#374151' };
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', fontSize: '2rem' }}>Transaction History</h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Track and manage your financial activities on the platform.</p>
                    </div>
                    <button 
                        onClick={exportToPDF}
                        disabled={transactions.length === 0}
                        className="btn btn-primary" 
                        style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Export Statement
                    </button>
                </div>

                {/* Filters Section */}
                <div className="dash-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: 'none', background: '#F8FAFC' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>STATUS</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}>
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed / Paid</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>ASSET</label>
                            <select name="asset" value={filters.asset} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }}>
                                <option value="">All Assets</option>
                                <option value="USD">USD</option>
                                {assets.map(a => <option key={a._id} value={a.symbol}>{a.name} ({a.symbol})</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>FROM DATE</label>
                            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748B', marginBottom: '0.5rem', display: 'block' }}>TO DATE</label>
                            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none' }} />
                        </div>
                        <button onClick={resetFilters} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                            Reset
                        </button>
                    </div>
                </div>

                <div className="dash-card" style={{ padding: '0', border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.03)' }}>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Transaction Type</th>
                                    <th>Asset</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}><div className="loading-spinner"></div></td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                                            <p style={{ color: '#94A3B8' }}>No transactions found for the selected filters.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ 
                                                        width: '32px', height: '32px', borderRadius: '8px', 
                                                        background: tx.type === 'deposit' ? 'rgba(16, 185, 129, 0.1)' : (tx.type === 'withdrawal' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(81, 112, 255, 0.1)'),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: tx.type === 'deposit' ? '#10B981' : (tx.type === 'withdrawal' ? '#EF4444' : '#5170FF')
                                                    }}>
                                                        {tx.type === 'deposit' ? '↓' : (tx.type === 'withdrawal' ? '↑' : '★')}
                                                    </div>
                                                    <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{tx.asset}</td>
                                            <td style={{ fontWeight: '600' }}>{tx.amount.toLocaleString()}</td>
                                            <td>
                                                <span className="status-badge" style={{ ...getStatusStyle(tx.status), padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                                                    {tx.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ color: '#64748B', fontSize: '0.85rem' }}>
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '1.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>
                                                {tx.details}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Transactions;
