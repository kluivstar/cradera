import React, { useState } from 'react';

export const AssetCard = ({ asset, isSelected, selectedNetwork, onSelect, onNetworkSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMultipleNetworks = asset.supportedNetworks?.length > 1;

    const handleToggle = (e) => {
        if (hasMultipleNetworks) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        } else {
            onSelect(asset);
        }
    };

    return (
        <div style={{ marginBottom: '0.75rem' }}>
            <div 
                onClick={handleToggle}
                className={`fintech-card ${isSelected && !hasMultipleNetworks ? 'asset-card-active' : ''}`}
                style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '1rem',
                    border: isExpanded ? '1px solid #E5E7EB' : '1px solid #F3F4F6'
                }}
            >
                <div style={{ 
                    width: '25px', 
                    height: '25px', 
                    borderRadius: '50%', 
                    background: isSelected ? 'var(--color-primary)' : '#F3F4F6', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    {asset.icon ? (
                        <img src={asset.icon} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ color: isSelected ? '#FFFFFF' : 'var(--color-primary)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="12"/>
                                <path d="M12 6v12M12 6l-3 3M12 6l3 3M12 18l-3-3M12 18l3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-primary)' }}>Sell {asset.name}</div>
                </div>
                {hasMultipleNetworks && (
                    <div style={{ 
                        color: 'var(--color-text-secondary)', 
                        transition: 'transform 0.3s ease', 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' 
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </div>
                )}
            </div>

            {hasMultipleNetworks && (
                <div style={{ 
                    overflow: 'hidden', 
                    maxHeight: isExpanded ? '500px' : '0', 
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: isExpanded ? '0.5rem' : '0'
                }}>
                    {asset.supportedNetworks.map((network, index) => (
                        <div 
                            key={index}
                            onClick={() => onNetworkSelect(asset, network)}
                            className={`network-item ${selectedNetwork?.networkName === network.networkName && isSelected ? 'network-active' : ''}`}
                            style={{
                                padding: '0.75rem 1rem 0.75rem 3.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                background: (selectedNetwork?.networkName === network.networkName && isSelected) ? 'var(--color-primary)' : 'transparent',
                                border: (selectedNetwork?.networkName === network.networkName && isSelected) ? 'none' : '1px solid #D1D5DB'
                            }}></span>
                            {asset.name} ({network.networkName})
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const WalletDetails = ({ asset, network, formData, handleChange, handleSubmit, submitting, copyToClipboard }) => {
    if (!asset || !network) return null;

    return (
        <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                {asset.symbol} ({network.networkName}) Wallet Details
            </h2>

            <div className="fintech-card" style={{ padding: '1.25rem' }}>
                <div className="alert-banner alert-warning" style={{ textAlign: 'left', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '0.1rem', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ margin: 0 }}>You can ONLY receive {asset.symbol} with the QR code or address below. It will be automatically converted to NAIRA.</p>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>DEPOSIT ADDRESS</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="wallet-address-box" style={{ flex: 1, padding: '0.75rem 1rem' }}>
                        <code style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500', letterSpacing: '0.01em', wordBreak: 'break-all' }}>
                            {network.walletAddress}
                        </code>
                        <button 
                            onClick={() => copyToClipboard(network.walletAddress)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                    <div style={{ 
                        width: '72px', height: '72px', background: '#FFFFFF', 
                        border: '1px solid #E5E7EB', borderRadius: '5px', padding: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', flexShrink: 0
                    }}>
                        {network.qrCode ? (
                            <img src={network.qrCode} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1">
                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M7 7h.01M17 7h.01M7 17h.01"/>
                            </svg>
                        )}
                    </div>
                </div>

                <div className="alert-banner alert-danger" style={{ marginBottom: '1.25rem', padding: '0.75rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '500' }}>Min. deposit: 0.00001 {asset.symbol}. Less will not be credited.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1.25rem' }}>
                    <div className="form-grid-2col" style={{ marginBottom: '1rem', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block', color: 'var(--color-text-secondary)' }}>AMOUNT SENT ($)</label>
                            <input 
                                type="number" name="amount" value={formData.amount} onChange={handleChange} 
                                placeholder="0.00" required 
                                style={{ width: '100%', padding: '0.625rem', borderRadius: '5px', border: '1px solid #F3F4F6', background: '#F9FAFB', outline: 'none', fontSize: '0.875rem' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block', color: 'var(--color-text-secondary)' }}>SENDING ADDRESS</label>
                            <input 
                                type="text" name="fromAddress" value={formData.fromAddress} onChange={handleChange} 
                                placeholder="Your wallet address" required 
                                style={{ width: '100%', padding: '0.625rem', borderRadius: '5px', border: '1px solid #F3F4F6', background: '#F9FAFB', outline: 'none', fontSize: '0.875rem' }}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block', color: 'var(--color-text-secondary)' }}>TRANSACTION HASH / TXID</label>
                        <input 
                            type="text" name="txHash" value={formData.txHash} onChange={handleChange} 
                            placeholder="Paste the transaction ID" required 
                            style={{ width: '100%', padding: '0.625rem', borderRadius: '5px', border: '1px solid #F3F4F6', background: '#F9FAFB', outline: 'none', fontSize: '0.875rem' }}
                        />
                    </div>
                    <button 
                        type="submit" disabled={submitting} 
                        style={{ width: '100%', padding: '16px', borderRadius: '5px', background: '#5170ff', color: '#FFFFFF', fontWeight: '500', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                        {submitting ? 'Processing...' : 'I have made the payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};
