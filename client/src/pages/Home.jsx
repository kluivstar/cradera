import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'var(--color-bg)'
    }}>
      <div style={{
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: '700',
        color: '#5170FF',
        letterSpacing: '-0.02em'
      }}>
        CRADERA
      </div>
      
      <h1 style={{
        fontSize: 'clamp(3rem, 8vw, 5rem)',
        marginBottom: '1.5rem',
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.02em',
        fontWeight: '500'
      }}>
        Coming Soon.
      </h1>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--color-text-secondary)',
        maxWidth: '600px',
        margin: '0 auto 3rem auto',
        lineHeight: '1.6'
      }}>
        We are building a premium digital asset platform tailored for institutional clients and elite users. Stay tuned for our upcoming launch.
      </p>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/login" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', textDecoration: 'none', borderRadius: '8px' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Home;
