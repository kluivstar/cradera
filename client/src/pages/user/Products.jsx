import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Products = () => {
    const products = [
        {
            id: 'crypto',
            title: 'Crypto Trading',
            description: 'Buy, sell, and swap digital assets with deep liquidity and zero hidden fees.',
            status: 'Active',
            icon: '🪙',
            category: 'Finance'
        },
        {
            id: 'giftcards',
            title: 'Gift Cards',
            description: 'Sell your gift cards at the best market rates and get paid instantly in Naira.',
            status: 'Active',
            icon: '🎁',
            category: 'Assets'
        },
        {
            id: 'airtime',
            title: 'Airtime & Data',
            description: 'Instant mobile recharge for all major networks globally with exclusive discounts.',
            status: 'Coming Soon',
            icon: '📱',
            category: 'Utility'
        },
        {
            id: 'esim',
            title: 'Global eSIM',
            description: 'Stay connected across 150+ countries with our instant activation eSIM services.',
            status: 'Coming Soon',
            icon: '🌐',
            category: 'Travel'
        },
        {
            id: 'bills',
            title: 'Bill Payments',
            description: 'Pay electricity, cable TV, and other utilities conveniently from your wallet.',
            status: 'Coming Soon',
            icon: '🧾',
            category: 'Utility'
        },
        {
            id: 'virtual-cards',
            title: 'Virtual Cards',
            description: 'Create USD virtual cards for global online shopping and subscriptions.',
            status: 'Coming Soon',
            icon: '💳',
            category: 'Finance'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.75rem', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                        Platform Services
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Institutional-grade financial tools designed for speed, security, and simplicity.
                    </p>
                </div>

                <div className="dashboard-grid" style={{ 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map((product) => (
                        <div key={product.id} className="dash-card" style={{ 
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            minHeight: '320px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                            cursor: product.status === 'Active' ? 'pointer' : 'default'
                        }}>
                            {/* Category Badge */}
                            <div style={{ 
                                position: 'absolute',
                                top: '2rem',
                                right: '2rem',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.1em'
                            }}>
                                {product.category}
                            </div>

                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                borderRadius: '16px', 
                                background: product.status === 'Active' ? 'rgba(56, 189, 248, 0.08)' : '#F9FAFB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                marginBottom: '1.75rem',
                                filter: product.status === 'Active' ? 'none' : 'grayscale(1)',
                                opacity: product.status === 'Active' ? 1 : 0.5,
                                flexShrink: 0,
                                border: product.status === 'Active' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid var(--color-border)'
                            }}>
                                {product.icon}
                            </div>
                            
                            <h3 style={{ 
                                fontSize: '1.35rem', 
                                fontWeight: '600',
                                marginBottom: '0.75rem', 
                                color: 'var(--color-primary)' 
                            }}>
                                {product.title}
                            </h3>
                            
                            <p style={{ 
                                fontSize: '1rem', 
                                color: 'var(--color-text-secondary)', 
                                lineHeight: '1.6', 
                                marginBottom: 'auto',
                                paddingBottom: '2rem'
                            }}>
                                {product.description}
                            </p>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                borderTop: '1px solid var(--color-border)',
                                paddingTop: '1.5rem',
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
                                        fontSize: '0.85rem', 
                                        fontWeight: '600', 
                                        color: product.status === 'Active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                                    }}>
                                        {product.status}
                                    </span>
                                </div>

                                {product.status === 'Active' ? (
                                    <button className="btn btn-accent" style={{ 
                                        padding: '0.5rem 1.25rem', 
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        Open App
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: '500' }}>Notify Me</span>
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
