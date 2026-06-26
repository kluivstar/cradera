import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      padding: '1.25rem 2rem',
      background: '#ffffff',
      borderTop: '1px solid var(--color-border)',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: 'var(--color-text-secondary)',
    }}>
      <p>&copy; {new Date().getFullYear()} Cradera. All rights reserved.</p>
    </footer>
  );
}