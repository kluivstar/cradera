import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Products = () => {
    const products = [
        {
            id: 'crypto',
            title: 'Crypto Trading',
            description: 'Buy, sell, and swap digital assets with deep liquidity and zero hidden fees.',
            status: 'Active',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                </svg>
            ),
            category: 'Finance'
        },
        {
            id: 'giftcards',
            title: 'Gift Cards',
            description: 'Sell your gift cards at the best market rates and get paid instantly in Naira.',
            status: 'Active',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
            ),
            category: 'Assets'
        },
        {
            id: 'airtime',
            title: 'Airtime & Data',
            description: 'Instant mobile recharge for all major networks globally with exclusive discounts.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
            ),
            category: 'Utility'
        },
        {
            id: 'esim',
            title: 'Global eSIM',
            description: 'Stay connected across 150+ countries with our instant activation eSIM services.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
            ),
            category: 'Travel'
        },
        {
            id: 'bills',
            title: 'Bill Payments',
            description: 'Pay electricity, cable TV, and other utilities conveniently from your wallet.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
            ),
            category: 'Utility'
        },
        {
            id: 'virtual-cards',
            title: 'Virtual Cards',
            description: 'Create USD virtual cards for global online shopping and subscriptions.',
            status: 'Coming Soon',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
            ),
            category: 'Finance'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontWeight: '600', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Platform Services
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.875rem', maxWidth: '500px', margin: '0 auto' }}>
                        Institutional-grade financial tools designed for speed, security, and simplicity.
                    </p>
                </div>

                <div className="dashboard-grid" style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem'
                }}>
                    {products.map((product) => (
                        <div key={product.id} className="dash-card" style={{ 
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '220px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: product.status === 'Active' ? 'pointer' : 'default',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                        }}>
                            {/* Category Badge */}
                            <div style={{ 
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                fontSize: '0.625rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.1em'
                            }}>
                                {product.category}
                            </div>

                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '10px', 
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                marginBottom: '1.25rem',
                                filter: product.status === 'Active' ? 'none' : 'grayscale(1)',
                                opacity: product.status === 'Active' ? 1 : 0.5,
                                flexShrink: 0,
                                color: 'var(--color-primary)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                {product.icon}
                            </div>
                            
                            <h3 style={{ 
                                fontSize: '1.1rem', 
                                fontWeight: '600',
                                marginBottom: '0.5rem', 
                                color: 'var(--color-primary)' 
                            }}>
                                {product.title}
                            </h3>
                            
                            <p style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--color-text-secondary)', 
                                lineHeight: '1.5', 
                                marginBottom: 'auto',
                                paddingBottom: '1rem'
                            }}>
                                {product.description}
                            </p>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                paddingTop: '1rem',
                                marginTop: 'auto'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        background: product.status === 'Active' ? '#10B981' : '#D1D5DB' 
                                    }}></div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: product.status === 'Active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                                    }}>
                                        {product.status}
                                    </span>
                                </div>

                                {product.status === 'Active' ? (
                                    <button className="btn btn-accent" style={{ 
                                        padding: '0.4rem 1rem', 
                                        fontSize: '0.8125rem',
                                        fontWeight: '600'
                                    }}>
                                        Open App
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500' }}>Notify Me</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
