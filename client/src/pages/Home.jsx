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
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Home;
