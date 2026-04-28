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
        fontSize: '3.5rem', 
        marginBottom: '1rem', 
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.04em',
        fontWeight: '800'
      }}>
        Digital Assets, <br />
        <span style={{ color: 'var(--color-primary)' }}>Reimagined.</span>
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--color-text-secondary)', 
        maxWidth: '560px', 
        margin: '0 auto 2.5rem auto',
        lineHeight: '1.5',
        fontWeight: '500'
      }}>
        Cradera is a premium digital asset platform tailored for institutional clients and elite users, built with modern aesthetics and maximum security.
      </p>
      
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: '800' }}>
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: '800' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Home;
