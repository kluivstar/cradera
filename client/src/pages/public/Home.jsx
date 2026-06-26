import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';

export default function PublicHome() {
  return (
    <PublicLayout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          maxWidth: '500px',
          boxShadow: '0 20px 40px rgba(11, 34, 83, 0.05)',
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            marginBottom: '0.5rem',
            fontFamily: 'ClashDisplay, sans-serif',
            letterSpacing: '-0.02em',
          }}>
            Cradera
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-accent)',
            fontWeight: '600',
            marginBottom: '1.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Coming Soon
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            marginBottom: '2.5rem',
          }}>
            We are crafting a modern platform for digital assets. Our website is under construction and will launch shortly.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link to="/login" className="auth-btn" style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'auto',
              minWidth: '130px',
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              fontWeight: '500',
            }}>
              Sign In
            </Link>
            <button disabled style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '180px',
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              fontWeight: '500',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              background: '#f1f5f9',
              cursor: 'not-allowed',
            }}>
              Register (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}