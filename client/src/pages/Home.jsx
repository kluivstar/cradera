import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center' 
    }}>
      <h1 style={{ 
        fontSize: '4.5rem', 
        marginBottom: '1.5rem', 
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.02em'
      }}>
        Digital Assets, <br />
        <span style={{ color: 'var(--color-primary)' }}>Reimagined.</span>
      </h1>
      <p style={{ 
        fontSize: '1.25rem', 
        color: 'var(--color-text-secondary)', 
        maxWidth: '640px', 
        margin: '0 auto 3rem auto',
        lineHeight: '1.6'
      }}>
        Cradera is a premium digital asset platform tailored for institutional clients and elite users, built with modern aesthetics and maximum security.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '6rem' }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Sign In
        </Link>
      </div>

      <div style={{ maxWidth: '1000px', width: '100%', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem auto', color: 'var(--color-primary)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Crypto Trading</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Institutional-grade liquidity for buying, selling, and swapping digital assets.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem auto', color: 'var(--color-primary)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Virtual Cards</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Instant USD virtual cards for global subscriptions and secure online shopping.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '16px', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 1.5rem auto', color: 'var(--color-primary)', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Secure Custody</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Military-grade encryption and multi-sig protocols protecting your digital wealth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
