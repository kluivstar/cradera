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
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-10)', textAlign: 'center' }}>
                    <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-2)' }}>
                        Platform Services
                    </h1>
                    <p className="dashboard-subtitle" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        Institutional-grade financial tools designed for speed, security, and simplicity.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-4)'
                }}>
                    {products.map((product) => (
                        <div key={product.id} className="dash-card product-card" style={{ 
                            padding: 'var(--spacing-6)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            minHeight: '260px',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative',
                            cursor: product.status === 'Active' ? 'pointer' : 'default'
                        }}>
                            {/* Category Badge */}
                            <div style={{ 
                                position: 'absolute',
                                top: 'var(--spacing-6)',
                                right: 'var(--spacing-6)',
                                fontSize: '10px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-secondary)',
                                letterSpacing: '0.05em'
                            }}>
                                {product.category}
                            </div>

                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: 'var(--radius-md)', 
                                background: product.status === 'Active' ? 'rgba(14, 165, 233, 0.08)' : '#F1F5F9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                marginBottom: 'var(--spacing-4)',
                                filter: product.status === 'Active' ? 'none' : 'grayscale(1)',
                                opacity: product.status === 'Active' ? 1 : 0.5,
                                border: product.status === 'Active' ? '1px solid rgba(14, 165, 233, 0.2)' : '1px solid var(--color-border)'
                            }}>
                                {product.icon}
                            </div>
                            
                            <h4 style={{ 
                                marginBottom: 'var(--spacing-2)', 
                                color: 'var(--color-primary)' 
                            }}>
                                {product.title}
                            </h4>
                            
                            <p style={{ 
                                fontSize: 'var(--font-size-xs)', 
                                color: 'var(--color-text-secondary)', 
                                lineHeight: '1.5', 
                                marginBottom: 'var(--spacing-6)'
                            }}>
                                {product.description}
                            </p>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                borderTop: '1px solid var(--color-border)',
                                paddingTop: 'var(--spacing-4)',
                                marginTop: 'auto'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                    <div style={{ 
                                        width: '6px', 
                                        height: '6px', 
                                        borderRadius: '50%', 
                                        background: product.status === 'Active' ? 'var(--color-success)' : '#CBD5E1' 
                                    }}></div>
                                    <span style={{ 
                                        fontSize: 'var(--font-size-xs)', 
                                        fontWeight: '600', 
                                        color: product.status === 'Active' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                                    }}>
                                        {product.status}
                                    </span>
                                </div>

                                {product.status === 'Active' ? (
                                    <button className="btn" style={{ 
                                        padding: '0.35rem 0.75rem', 
                                        fontSize: 'var(--font-size-xs)',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none'
                                    }}>
                                        Open App
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Notify Me</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .product-card:hover { transform: translateY(-3px); border-color: var(--color-accent); box-shadow: 0 4px 12px rgba(14, 165, 233, 0.06); }
            `}</style>
        </DashboardLayout>
    );
};

export default Products;
