import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
  ];

  const handleScroll = (e, href) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 5%',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
      zIndex: 1000,
      fontFamily: 'Outfit, sans-serif',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={() => window.scrollTo(0,0)}>
        <img src={logo} alt="Cradera" style={{ height: '102px', width: 'auto' }} />
        
      </Link>
      
      <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            style={{
              textDecoration: 'none',
              color: '#475569',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#2563eb'}
            onMouseOut={(e) => e.target.style.color = '#475569'}
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#0f172a',
            fontWeight: '600',
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'color 0.2s',
            fontFamily: 'Outfit, sans-serif'
          }}
          onMouseOver={(e) => e.target.style.color = '#2563eb'}
          onMouseOut={(e) => e.target.style.color = '#0f172a'}
          >
            Log In
          </button>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
            transition: 'background 0.2s, transform 0.1s',
            fontFamily: 'Outfit, sans-serif'
          }}
          onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.background = '#2563eb'}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </header>
  );
}
