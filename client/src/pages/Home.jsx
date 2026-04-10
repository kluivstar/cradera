import React from 'react';

const Home = () => {
  return (
    <div className="fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, var(--color-text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Welcome to Cradera
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        A platform rebuilt from the ground up for maximum power and modern aesthetics.
      </p>
      
      <button style={{
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        fontWeight: '600',
        borderRadius: '50px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(150, 50, 255, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
