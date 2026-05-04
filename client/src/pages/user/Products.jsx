import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const Products = () => {
    const products = [
        {
            id: 'sell-crypto',
            title: 'Buy/Sell Crypto',
            description: 'Buy or sell Bitcoin, USDT, and other digital assets instantly.',
            status: 'Active',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                </svg>
            ),
            category: 'Finance',
            to: '/dashboard/crypto-actions'
        },
        {
            id: 'giftcards',
            title: 'Buy Gift Card',
            description: 'Purchase global gift cards at the best rates with your wallet balance.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
            ),
            category: 'Assets'
        },
        {
            id: 'esim',
            title: 'eSIM',
            description: 'Instant global connectivity with our low-cost eSIM data plans.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
            ),
            category: 'Travel'
        },
        {
            id: 'buy-airtime',
            title: 'Buy Airtime',
            description: 'Top up your mobile phone instantly across all major networks.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
            ),
            category: 'Utility'
        },
        {
            id: 'sell-airtime',
            title: 'Sell Airtime',
            description: 'Convert your excess airtime to cash in your Naira wallet.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1v22M5 8l7-7 7 7M5 16l7 7 7-7"/>
                </svg>
            ),
            category: 'Finance'
        },
        {
            id: 'buy-data',
            title: 'Buy Data',
            description: 'Purchase internet data bundles for your mobile and home devices.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
            ),
            category: 'Utility'
        }
    ];

    const navigate = useNavigate();

    const handleProductClick = (product) => {
        if (product.status === 'Active' && product.to) {
            navigate(product.to);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontWeight: '500', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                        Products
                    </h1>
                    
                </div>

                <div className="dashboard-grid" style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem',
                    justifyContent: 'center'
                }}>
                    {products.map((product) => (
                        <div key={product.id} onClick={() => handleProductClick(product)} className="dash-card" style={{ 
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '180px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: product.status === 'Active' ? 'pointer' : 'default',
                            background: '#FFFFFF'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '8px', 
                                    background: '#F3F4F6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-primary)',
                                    opacity: product.status === 'Active' ? 1 : 0.5
                                }}>
                                    {product.icon}
                                </div>
                                <span style={{ 
                                    fontSize: '0.65rem', 
                                    fontWeight: '400', 
                                    padding: '0.2rem 0.5rem', 
                                    borderRadius: '4px',
                                    background: product.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : '#F3F4F6',
                                    color: product.status === 'Active' ? '#10B981' : '#9CA3AF',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {product.status}
                                </span>
                            </div>
                            
                            <h3 style={{ 
                                fontSize: '0.95rem', 
                                fontWeight: '500',
                                marginBottom: '0.35rem', 
                                color: 'var(--color-primary)' 
                            }}>
                                {product.title}
                            </h3>
                            
                            <p style={{ 
                                fontSize: '0.8125rem', 
                                color: 'var(--color-text-secondary)', 
                                lineHeight: '1.4', 
                                marginBottom: 'auto'
                            }}>
                                {product.description}
                            </p>
                            
                            {product.status === 'Active' && (
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                                    <button className="btn btn-primary" style={{ 
                                        padding: '0.75rem 1.5rem', 
                                        fontSize: '0.85rem',
                                        background: '#5170ff',
                                        color: '#FFFFFF',
                                        borderRadius: '10px',
                                        width: '100%',
                                        fontWeight: '700'
                                    }}>
                                        Start Trading
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .product-card {
                    padding: 2rem !important;
                    min-height: 190px !important;
                    width: calc(100% - 20px) !important;
                    margin: 0 auto;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default Products;
