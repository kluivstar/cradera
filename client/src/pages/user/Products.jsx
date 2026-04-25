import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Products = () => {
    const products = [
        {
            id: 'crypto',
            title: 'Crypto Assets',
            description: 'Buy and sell digital assets with institutional liquidity.',
            status: 'Active',
            icon: '🪙',
            color: 'var(--color-primary)'
        },
        {
            id: 'airtime',
            title: 'Airtime & Data',
            description: 'Top up your mobile services instantly across 100+ countries.',
            status: 'Coming Soon',
            icon: '📱',
            color: '#9CA3AF'
        },
        {
            id: 'esim',
            title: 'Global eSIM',
            description: 'Stay connected anywhere with our borderless eSIM solutions.',
            status: 'Coming Soon',
            icon: '🌐',
            color: '#9CA3AF'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in">
                <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '600', color: 'var(--color-primary)' }}>Our Products</h1>
                    <p className="dashboard-subtitle">Select a service to get started with institutional-grade tools.</p>
                </div>

                <div className="dashboard-grid" style={{ 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {products.map((product) => (
                        <div key={product.id} className="dash-card" style={{ 
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            minHeight: '280px'
                        }}>
                            <div style={{ 
                                width: '56px', 
                                height: '56px', 
                                borderRadius: '12px', 
                                background: product.status === 'Active' ? 'rgba(56, 189, 248, 0.1)' : '#F3F4F6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                fontSize: '1.75rem',
                                marginBottom: '1.25rem',
                                filter: product.status === 'Active' ? 'none' : 'grayscale(1)',
                                opacity: product.status === 'Active' ? 1 : 0.6,
                                flexShrink: 0
                            }}>
                                <span style={{ margin: 'auto' }}>{product.icon}</span>
                            </div>
                            
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                                {product.title}
                            </h3>
                            
                            <p style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--color-text-secondary)', 
                                lineHeight: '1.6', 
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
                                paddingTop: '1.25rem',
                                marginTop: 'auto'
                            }}>
                                <span style={{ 
                                    fontSize: '0.75rem', 
                                    fontWeight: '700', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.05em',
                                    color: product.status === 'Active' ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                                }}>
                                    {product.status}
                                </span>
                                {product.status === 'Active' && (
                                    <button className="btn btn-accent" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                        Explore
                                    </button>
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
