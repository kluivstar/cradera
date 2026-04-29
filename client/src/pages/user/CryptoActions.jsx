import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const CryptoActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            id: 'sell',
            title: 'Sell Crypto',
            description: 'Convert your digital assets to instant Naira cash.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
            ),
            active: true,
            to: '/dashboard/sell-crypto'
        },
        {
            id: 'buy',
            title: 'Buy Crypto',
            description: 'Purchase top assets with competitive market rates.',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
            ),
            active: false,
            badge: 'Coming Soon'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-content fade-in" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '70vh',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '500', 
                        color: 'var(--color-primary)', 
                        letterSpacing: '-0.02em',
                        marginBottom: '0.75rem'
                    }}>
                        What would you like to do?
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                        Select an action to proceed with your digital assets.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '1.5rem', 
                    width: '100%' 
                }}>
                    {actions.map((action) => (
                        <div 
                            key={action.id}
                            onClick={() => action.active && action.to && navigate(action.to)}
                            style={{ 
                                background: 'white',
                                padding: '2.5rem 2rem',
                                borderRadius: '24px',
                                textAlign: 'center',
                                cursor: action.active ? 'pointer' : 'not-allowed',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                opacity: action.active ? 1 : 0.6,
                                filter: action.active ? 'none' : 'grayscale(0.5)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                border: '1px solid transparent'
                            }}
                            className={action.active ? 'action-card-active' : ''}
                        >
                            {!action.active && action.badge && (
                                <span style={{
                                    position: 'absolute',
                                    top: '1.25rem',
                                    right: '1.25rem',
                                    background: '#F3F4F6',
                                    color: '#6B7280',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {action.badge}
                                </span>
                            )}

                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                borderRadius: '18px', 
                                background: action.active ? 'rgba(11, 34, 83, 0.05)' : '#F9FAFB',
                                color: action.active ? 'var(--color-primary)' : '#9CA3AF',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                {action.icon}
                            </div>

                            <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '600', 
                                color: 'var(--color-primary)', 
                                marginBottom: '0.75rem' 
                            }}>
                                {action.title}
                            </h3>
                            <p style={{ 
                                color: 'var(--color-text-secondary)', 
                                fontSize: '0.875rem', 
                                lineHeight: '1.6',
                                maxWidth: '200px'
                            }}>
                                {action.description}
                            </p>

                            <style dangerouslySetInnerHTML={{ __html: `
                                .action-card-active:hover {
                                    transform: translateY(-8px);
                                    box-shadow: 0 20px 40px rgba(11, 34, 83, 0.08) !important;
                                    border-color: rgba(11, 34, 83, 0.1) !important;
                                }
                            `}} />
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => navigate(-1)}
                    style={{ 
                        marginTop: '3rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Go Back
                </button>
            </div>
        </DashboardLayout>
    );
};

export default CryptoActions;
