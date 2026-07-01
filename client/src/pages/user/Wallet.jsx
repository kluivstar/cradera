import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Wallet = () => {
    const { user } = useAuth();
    
    // UI state
    const [activeCategory, setActiveCategory] = useState('fiat'); // 'fiat' or 'points'
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerTab, setDrawerTab] = useState('earnings'); // 'earnings' or 'spending'
    
    // Ledger and withdrawal data
    const [ledgerRecords, setLedgerRecords] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [withdrawalsPage, setWithdrawalsPage] = useState(1);
    const [withdrawalsTotalPages, setWithdrawalsTotalPages] = useState(1);
    
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
    const [loadingLedger, setLoadingLedger] = useState(false);
    const [error, setError] = useState('');

    // Fetch user withdrawals with pagination
    const fetchWithdrawals = useCallback(async (page = 1) => {
        try {
            setLoadingWithdrawals(true);
            const res = await api.get(`/withdrawals/me?page=${page}&limit=5`);
            setWithdrawals(res.data.withdrawals || []);
            setWithdrawalsTotalPages(res.data.pagination?.pages || 1);
            setWithdrawalsPage(res.data.pagination?.page || 1);
        } catch (err) {
            console.error('Failed to fetch withdrawals:', err);
            setError('Could not load withdrawal history.');
        } finally {
            setLoadingWithdrawals(false);
        }
    }, []);

    // Fetch user ledger (credits/debits)
    const fetchLedger = useCallback(async () => {
        try {
            setLoadingLedger(true);
            const res = await api.get(`/ledger/me?limit=100`);
            setLedgerRecords(res.data.records || []);
        } catch (err) {
            console.error('Failed to fetch ledger:', err);
        } finally {
            setLoadingLedger(false);
        }
    }, []);

    useEffect(() => {
        fetchWithdrawals(1);
        fetchLedger();
    }, [fetchWithdrawals, fetchLedger]);

    // Handle withdrawal pagination click
    const handlePrevPage = () => {
        if (withdrawalsPage > 1) {
            fetchWithdrawals(withdrawalsPage - 1);
        }
    };

    const handleNextPage = () => {
        if (withdrawalsPage < withdrawalsTotalPages) {
            fetchWithdrawals(withdrawalsPage + 1);
        }
    };

    // Filter ledger records for drawer
    const earnings = ledgerRecords.filter(r => r.walletType === 'fiat' && r.type === 'credit');
    const spending = ledgerRecords.filter(r => r.walletType === 'fiat' && r.type === 'debit');
    const pointsHistory = ledgerRecords.filter(r => r.walletType === 'points');

    // Export Statement helper
    const downloadCSV = () => {
        const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Running Balance', 'Status'];
        const rows = ledgerRecords
            .filter(r => r.walletType === activeCategory)
            .map(r => [
                new Date(r.createdAt).toLocaleDateString(),
                r.type.toUpperCase(),
                r.category.toUpperCase(),
                r.description,
                activeCategory === 'fiat' ? `₦${r.amount.toFixed(2)}` : `${r.amount} Points`,
                activeCategory === 'fiat' ? `₦${r.runningBalance.toFixed(2)}` : `${r.runningBalance} Points`,
                r.status.toUpperCase()
            ]);

        let csvContent = "data:text/csv;charset=utf-8,\ufeff" 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Cradera_${activeCategory}_Statement_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.setTextColor(11, 34, 83);
        doc.text(`${activeCategory === 'fiat' ? 'Fiat' : 'Gift Points'} Account Statement`, 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        
        const tableColumn = ["Date", "Type", "Category", "Description", "Amount", "Running Bal."];
        const tableRows = [];

        ledgerRecords
            .filter(r => r.walletType === activeCategory)
            .forEach(r => {
                const amountText = activeCategory === 'fiat' ? `₦${r.amount.toFixed(2)}` : `${r.amount} Points`;
                const runBalText = activeCategory === 'fiat' ? `₦${r.runningBalance.toFixed(2)}` : `${r.runningBalance} Points`;
                
                tableRows.push([
                    new Date(r.createdAt).toLocaleDateString(),
                    r.type.toUpperCase(),
                    r.category.toUpperCase().replace('_', ' '),
                    r.description,
                    amountText,
                    runBalText
                ]);
            });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 38,
            theme: 'striped',
            headStyles: { fillColor: [11, 34, 83], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [249, 250, 251] },
        });

        doc.save(`Cradera_${activeCategory}_Statement_${new Date().getTime()}.pdf`);
    };

    const getStatusBadgeStyle = (status) => {
        const s = status?.toLowerCase();
        if (['paid', 'confirmed', 'completed'].includes(s)) {
            return { background: 'rgba(16, 185, 129, 0.1)', color: '#059669' };
        }
        if (['pending', 'processing'].includes(s)) {
            return { background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' };
        }
        return { background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626' };
    };

    return (
        <DashboardLayout title="Wallet">
            <div className="dashboard-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
                
                {/* WALLET CATEGORY SELECTOR */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    <button 
                        onClick={() => setActiveCategory('fiat')}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '20px',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            background: activeCategory === 'fiat' ? 'var(--color-primary)' : 'transparent',
                            color: activeCategory === 'fiat' ? 'white' : 'var(--color-text-secondary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Fiat Wallet
                    </button>
                    <button 
                        onClick={() => setActiveCategory('points')}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '20px',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            background: activeCategory === 'points' ? 'var(--color-primary)' : 'transparent',
                            color: activeCategory === 'points' ? 'white' : 'var(--color-text-secondary)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Gift Points Wallet
                    </button>
                </div>

                {/* ERROR ALERT */}
                {error && <div className="alert-banner alert-danger" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>{error}</div>}

                {/* FIAT WALLET VIEW */}
                {activeCategory === 'fiat' && (
                    <div>
                        {/* WALLET SELECTOR */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {/* Naira Wallet */}
                            <div className="dash-card wallet-selector-card" style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '2px solid var(--color-primary)',
                                background: 'white',
                                minWidth: '150px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.08)'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 16V8h3a3 3 0 0 1 0 6H9M8 12h8" />
                                    </svg>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '600' }}>Naira Wallet</p>
                                </div>
                            </div>
                            
                            {/* USD Wallet (Disabled / Coming Soon) */}
                            <div className="dash-card wallet-selector-card-disabled" style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border)',
                                background: '#f8fafc',
                                minWidth: '170px',
                                opacity: 0.6,
                                cursor: 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.08)'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v12M15 8H11.5a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5H9" />
                                    </svg>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>USD Wallet</p>
                                    <span style={{ 
                                        display: 'inline-block',
                                        background: 'var(--color-border)', 
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.65rem',
                                        fontWeight: '600',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px',
                                        marginTop: '0.2rem'
                                    }}>COMING SOON</span>
                                </div>
                            </div>
                        </div>

                        {/* BALANCE OVERVIEW CARD */}
                        <div className="dash-card balance-section" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>Current Fiat Balance</p>
                                <h2 style={{ fontSize: '1.875rem', fontWeight: '400', color: 'var(--color-primary)' }}>
                                    ₦{(user?.availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h2>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <Link to="/dashboard/withdraw" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '110px' }}>
                                    Withdraw
                                </Link>
                                <Link to="/dashboard/deposits" className="btn btn-second" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '110px' }}>
                                    Add Funds
                                </Link>
                                <Link to="/dashboard/settings" className="btn btn-second" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '130px', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}>
                                    Bank Account
                                </Link>
                            </div>
                        </div>

                        {/* VIEW BREAKDOWN BUTTON */}
                        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
                            <button 
                                onClick={() => setIsDrawerOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#5170ff',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.5rem 0'
                                }}
                            >
                                View Wallet Breakdown 
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </button>
                        </div>

                        {/* WITHDRAWAL HISTORY */}
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem' }}>Withdrawal History</h3>
                            
                            <div className="dash-card" style={{ padding: 0, overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Reference</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Amount</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Method</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingWithdrawals ? (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                                    <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid #5170ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '0.5rem' }}></div>
                                                    Loading history...
                                                </td>
                                            </tr>
                                        ) : withdrawals.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                                    No withdrawals found.
                                                </td>
                                            </tr>
                                        ) : (
                                            withdrawals.map(w => (
                                                <tr key={w._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{new Date(w.createdAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', fontFamily: 'monospace', color: 'var(--color-text-secondary)' }}>#{w._id.substring(w._id.length - 8)}</td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600' }}>₦{w.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textTransform: 'capitalize' }}>{w.payoutMethod}</td>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <span style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase',
                                                            ...getStatusBadgeStyle(w.status)
                                                        }}>
                                                            {w.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Withdrawal Pagination */}
                            {withdrawalsTotalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button 
                                        onClick={handlePrevPage} 
                                        disabled={withdrawalsPage === 1}
                                        style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-primary)', cursor: withdrawalsPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8125rem' }}
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        onClick={handleNextPage} 
                                        disabled={withdrawalsPage === withdrawalsTotalPages}
                                        style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-primary)', cursor: withdrawalsPage === withdrawalsTotalPages ? 'not-allowed' : 'pointer', fontSize: '0.8125rem' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* GIFT POINTS WALLET VIEW */}
                {activeCategory === 'points' && (
                    <div>
                        {/* BALANCE OVERVIEW CARD */}
                        <div className="dash-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>Current Gift Points Balance</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '600', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {(user?.giftPoints || 0).toLocaleString()} 
                                <span style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: '600', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>Points</span>
                            </h2>
                        </div>

                        {/* GIFT POINTS HISTORY */}
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>Gift Point Transaction History</h3>
                                <button 
                                    onClick={downloadPDF}
                                    disabled={pointsHistory.length === 0}
                                    style={{
                                        border: '1px solid var(--color-border)',
                                        background: 'white',
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        cursor: pointsHistory.length === 0 ? 'not-allowed' : 'pointer',
                                        color: 'var(--color-primary)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}
                                >
                                    Download Statement
                                </button>
                            </div>
                            
                            <div className="dash-card" style={{ padding: 0, overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Date</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Description</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Points Action</th>
                                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Balance Impact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsHistory.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                                    No gift points history found.
                                                </td>
                                            </tr>
                                        ) : (
                                            pointsHistory.map(r => (
                                                <tr key={r._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{r.description}</td>
                                                    <td style={{ 
                                                        padding: '1rem 1.5rem', 
                                                        fontSize: '0.875rem', 
                                                        fontWeight: '600',
                                                        color: r.type === 'credit' ? '#059669' : '#dc2626'
                                                    }}>
                                                        {r.type === 'credit' ? '+' : '-'}{r.amount.toLocaleString()} pts
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{r.runningBalance.toLocaleString()} pts</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* BREAKDOWN SLIDE-OVER DRAWER */}
                {isDrawerOpen && (
                    <div>
                        {/* Drawer Backdrop Overlay */}
                        <div 
                            onClick={() => setIsDrawerOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(15, 23, 42, 0.3)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 1000,
                                animation: 'fadeIn 0.2s ease'
                            }}
                        />
                        
                        {/* Drawer Panel */}
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            maxWidth: '460px',
                            background: 'white',
                            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.05)',
                            zIndex: 1001,
                            padding: '2rem 1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            animation: 'slideIn 0.3s ease-out',
                            textAlign: 'left'
                        }}>
                            
                            {/* Drawer Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: 'var(--color-primary)', margin: 0 }}>Wallet Breakdown</h3>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '0.2rem' }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="12"/></svg>
                                </button>
                            </div>

                            {/* Drawer Tabs */}
                            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                                <button 
                                    onClick={() => setDrawerTab('earnings')}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 0',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: drawerTab === 'earnings' ? '2px solid #5170ff' : 'none',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        color: drawerTab === 'earnings' ? '#5170ff' : 'var(--color-text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Earnings (Credits)
                                </button>
                                <button 
                                    onClick={() => setDrawerTab('spending')}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem 0',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: drawerTab === 'spending' ? '2px solid #5170ff' : 'none',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        color: drawerTab === 'spending' ? '#5170ff' : 'var(--color-text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Spending History
                                </button>
                            </div>

                            {/* Drawer Log List */}
                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.2rem' }}>
                                {drawerTab === 'earnings' ? (
                                    earnings.length === 0 ? (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginTop: '2rem' }}>No positive movements found.</p>
                                    ) : (
                                        earnings.map(r => (
                                            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0, color: 'var(--color-primary)' }}>{r.description}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0 0' }}>{new Date(r.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669', margin: 0 }}>+₦{r.amount.toFixed(2)}</p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', margin: 0 }}>Bal: ₦{r.runningBalance.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    spending.length === 0 ? (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginTop: '2rem' }}>No negative movements found.</p>
                                    ) : (
                                        spending.map(r => (
                                            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', margin: 0, color: 'var(--color-primary)' }}>{r.description}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0 0 0' }}>{new Date(r.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', margin: 0 }}>-₦{r.amount.toFixed(2)}</p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', margin: 0 }}>Bal: ₦{r.runningBalance.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>

                            {/* Drawer Footer Actions */}
                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>DOWNLOAD STATEMENT HISTORY</p>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button 
                                        onClick={downloadPDF}
                                        disabled={ledgerRecords.length === 0}
                                        style={{
                                            flex: 1,
                                            padding: '0.65rem 0',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            cursor: ledgerRecords.length === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        PDF Format
                                    </button>
                                    <button 
                                        onClick={downloadCSV}
                                        disabled={ledgerRecords.length === 0}
                                        style={{
                                            flex: 1,
                                            padding: '0.65rem 0',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-border)',
                                            background: 'white',
                                            color: 'var(--color-primary)',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            cursor: ledgerRecords.length === 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        CSV Format
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
            
            {/* Embedded styles for spins and drawer keyframes */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>

        </DashboardLayout>
    );
};

export default Wallet;
