import React from 'react';

const CurrencyIcon = ({ symbol, size = 20, className = "" }) => {
    const s = symbol?.toUpperCase();

    // Minimalist SVG icons for common currencies
    const getIcon = () => {
        switch (s) {
            case 'BTC':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M6 12h9a3 3 0 0 1 0 6H6V6h8a3 3 0 0 1 0 6H6z"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="12" y1="3" x2="12" y2="21"/>
                    </svg>
                );
            case 'ETH':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M12 2L4.5 12 12 22l7.5-10L12 2z"/><path d="M12 22V12"/><path d="M4.5 12L12 15.5 19.5 12"/>
                    </svg>
                );
            case 'USDT':
            case 'USDC':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
                    </svg>
                );
            case 'SOL':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M4 17l4-4 4 4 4-4 4 4"/><path d="M4 7l4-4 4 4 4-4 4 4"/>
                    </svg>
                );
            case 'BNB':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M12 2l4 4-4 4-4-4 4-4z"/><path d="M16 10l4 4-4 4-4-4 4-4z"/><path d="M8 10l-4 4 4 4 4-4-4-4z"/><path d="M12 18l4 4-4 4-4-4 4-4z"/>
                    </svg>
                );
            case 'NGN':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M6 12h12"/><path d="M6 16h12"/><path d="M8 7v10"/><path d="M16 7v10"/><path d="M12 3v18"/>
                    </svg>
                );
            default:
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                    </svg>
                );
        }
    };

    return getIcon();
};

export default CurrencyIcon;
