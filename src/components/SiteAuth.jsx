import React, { useState, useEffect } from 'react';

// Simple site-wide authentication wrapper
// For demo: username "admin", password "admin123"
const SITE_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const SITE_AUTH_KEY = 'siteAuthenticated';

const SiteAuth = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated in sessionStorage
    const isAuth = sessionStorage.getItem(SITE_AUTH_KEY);
    if (isAuth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === SITE_CREDENTIALS.username && password === SITE_CREDENTIALS.password) {
      sessionStorage.setItem(SITE_AUTH_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
      setPassword('');
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>🔒 Site Authentication</h2>
        <p style={{ marginBottom: '24px', color: '#666', fontSize: '14px' }}>
          Please authenticate to access this site
        </p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {error && (
            <p style={{ color: '#e74c3c', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Authenticate
          </button>
        </form>
        <p style={{ marginTop: '24px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
          Demo credentials: admin / admin123
        </p>
      </div>
    </div>
  );
};

export default SiteAuth;
