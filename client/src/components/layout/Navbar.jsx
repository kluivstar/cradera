import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Center the logo for a clean Coming Soon header layout
      padding: '1.25rem 2rem',
      background: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="Cradera Logo" style={{ height: '36px', width: 'auto' }} />
      </Link>
    </header>
  );
}
