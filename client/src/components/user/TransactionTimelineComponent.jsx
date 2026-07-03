import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';

const STAGE_CONFIGS = {
    INITIATED: { label: 'Initiated', percent: 15, color: '#3b82f6', desc: 'Transaction has been registered on the platform.' },
    DEPOSIT_DETECTED: { label: 'Deposit Detected', percent: 40, color: '#6366f1', desc: 'Deposit transaction has been detected on the network.' },
    BLOCKCHAIN_CONFIRMING: { label: 'Confirming On-chain', percent: 65, color: '#f59e0b', desc: 'Verifying on-chain transaction blocks.' },
    PROCESSING: { label: 'Processing', percent: 65, color: '#10b981', desc: 'Administrator is validating transaction parameters.' },
    PAYOUT_SENT: { label: 'Payout Dispatched', percent: 85, color: '#8b5cf6', desc: 'Funds have been dispatched to destination address.' },
    COMPLETED: { label: 'Completed', percent: 100, color: '#10b981', desc: 'Transaction finished successfully.' },
    FAILED: { label: 'Failed', percent: 100, color: '#ef4444', desc: 'Transaction failed or was rejected.' }
};

const TransactionTimelineComponent = ({ transactionId, onClose }) => {
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTimeline = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            const res = await api.get(`/timeline/${transactionId}`);
            setTimeline(res.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load transaction tracking logs.');
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [transactionId]);

    useEffect(() => {
        // Initial fetch with loader
        fetchTimeline(true);

        // Real-time updates via short polling (every 5 seconds)
        const interval = setInterval(() => {
            fetchTimeline(false);
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchTimeline]);

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #5170ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Connecting to live tracker...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', fontWeight: '500' }}>{error}</p>
                <button onClick={() => fetchTimeline(true)} className="btn btn-second" style={{ marginTop: '1rem' }}>Retry Connection</button>
            </div>
        );
    }

    const currentStatus = timeline?.currentStatus || 'INITIATED';
    const config = STAGE_CONFIGS[currentStatus] || STAGE_CONFIGS.INITIATED;
    const isFailed = currentStatus === 'FAILED';

    return (
        <div style={{ textAlign: 'left', fontFamily: 'var(--font-base)' }}>
            
            {/* Header / Info Section */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', textTransform: 'uppercase' }}>TRACKING ID</span>
                        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '600' }}>#{transactionId}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block', textTransform: 'uppercase' }}>TYPE</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', color: timeline?.type === 'deposit' ? '#10b981' : '#8b5cf6' }}>
                            {timeline?.type}
                        </span>
                    </div>
                </div>
                
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: '500', display: 'block' }}>ESTIMATED STATUS</span>
                        <span style={{ fontSize: '1rem', fontWeight: '600', color: isFailed ? '#ef4444' : 'var(--color-primary)' }}>{config.label}</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: isFailed ? '#ef4444' : '#10b981' }}>
                        {config.percent}%
                    </div>
                </div>
            </div>

            {/* Estimated Progress Bar */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${config.percent}%`,
                        height: '100%',
                        background: isFailed ? '#ef4444' : 'linear-gradient(90deg, #5170ff, #10b981)',
                        borderRadius: '4px',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{config.desc}</p>
            </div>

            {/* Transaction Timeline Stages List */}
            <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #e2e8f0', marginLeft: '0.5rem' }}>
                
                {timeline?.events.map((event, idx) => {
                    const eventConfig = STAGE_CONFIGS[event.status] || STAGE_CONFIGS.INITIATED;
                    const eventIsFailed = event.status === 'FAILED';
                    const isLast = idx === timeline.events.length - 1;

                    return (
                        <div key={event._id} style={{ position: 'relative', marginBottom: isLast ? '0' : '1.75rem' }}>
                            {/* Dot indicator */}
                            <div style={{
                                position: 'absolute',
                                left: '-2.05rem',
                                top: '0.2rem',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: eventIsFailed ? '#ef4444' : (isLast ? '#10b981' : '#94a3b8'),
                                border: '3px solid white',
                                boxShadow: '0 0 0 2px ' + (eventIsFailed ? 'rgba(239, 68, 68, 0.2)' : (isLast ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)'))
                            }} />

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: eventIsFailed ? '#ef4444' : 'var(--color-primary)' }}>
                                        {eventConfig.label}
                                    </h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                        {new Date(event.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Close / Action footer */}
            {onClose && (
                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <button onClick={onClose} className="btn btn-second" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer', background: 'white' }}>
                        Dismiss Tracker
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionTimelineComponent;
