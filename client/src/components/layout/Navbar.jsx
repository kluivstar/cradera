import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2rem',
      background: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <img src={logo} alt="Cradera Logo" style={{ height: '36px', width: 'auto' }} />
      </Link>
      <Link to="/login" style={{
        textDecoration: 'none',
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '0.9rem',
        color: '#ffffff',
        background: 'var(--color-primary)',
        transition: 'background-color 0.2s',
      }}>
        Sign In
      </Link>
    </header>
  );
}