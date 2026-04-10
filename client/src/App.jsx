import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

// Minimal App setup with routing
function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    // Optionally ping backend
    const checkHealth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        const data = await res.json();
        setHealthStatus(data.status === 'ok' ? 'API Online' : 'API Error');
      } catch (err) {
        setHealthStatus('API Offline');
      }
    };
    checkHealth();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header>
          <div className="logo">Cradera</div>
          <div className="status-badge" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid var(--color-border)', borderRadius: '20px', color: 'var(--color-text-secondary)' }}>
            {healthStatus}
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
