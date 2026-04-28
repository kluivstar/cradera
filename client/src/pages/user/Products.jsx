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
            <div className="dashboard-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="dashboard-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Platform Services
                    </h1>
                    <p className="dashboard-subtitle" style={{ fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
                        Institutional-grade financial tools designed for speed, security, and simplicity.
                    </p>
                </div>

                <div className="dashboard-grid" style={{ 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {products.map((product) => (
                        <div key={product.id} className="dash-card" style={{ 
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            minHeight: '260px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            cursor: product.status === 'Active' ? 'pointer' : 'default'
                        }}>
                            {/* Category Badge */}
                            <div style={{ 
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.05em'
                            }}>
                                {product.category}
                            </div>

                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '12px', 
                                background: product.status === 'Active' ? 'rgba(56, 189, 248, 0.08)' : '#F9FAFB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                marginBottom: '1.25rem',
                                filter: product.status === 'Active' ? 'none' : 'grayscale(1)',
                                opacity: product.status === 'Active' ? 1 : 0.5,
                                flexShrink: 0,
                                border: product.status === 'Active' ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid var(--color-border)'
                            }}>
                                {product.icon}
                            </div>
                            
                            <h3 style={{ 
                                fontSize: '1.1rem', 
                                fontWeight: '700',
                                marginBottom: '0.5rem', 
                                color: 'var(--color-primary)' 
                            }}>
                                {product.title}
                            </h3>
                            
                            <p style={{ 
                                fontSize: '0.85rem', 
                                color: 'var(--color-text-secondary)', 
                                lineHeight: '1.5', 
                                marginBottom: 'auto',
                                paddingBottom: '1.5rem'
                            }}>
                                {product.description}
                            </p>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                borderTop: '1px solid var(--color-border)',
                                paddingTop: '1rem',
                                marginTop: 'auto'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ 
                                        width: '6px', 
                                        height: '6px', 
                                        borderRadius: '50%', 
                                        background: product.status === 'Active' ? '#10B981' : '#D1D5DB' 
                                    }}></div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '700', 
                                        color: product.status === 'Active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                                    }}>
                                        {product.status}
                                    </span>
                                </div>

                                {product.status === 'Active' ? (
                                    <button className="btn btn-accent" style={{ 
                                        padding: '0.4rem 1rem', 
                                        fontSize: '0.8rem',
                                        fontWeight: '700'
                                    }}>
                                        Open App
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '600' }}>Notify Me</span>
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
