import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  // Captcha state
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: '' });
  const [captchaError, setCaptchaError] = useState('');

  // Generate new captcha
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, answer: '' });
    setCaptchaError('');
  };
  React.useEffect(() => { generateCaptcha(); }, []);
    const users = useMemo(() => {
      try {
        const raw = localStorage.getItem('registeredUsers');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }, []);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowLoginForm(true);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCaptchaChange = (e) => {
    setCaptcha(prev => ({ ...prev, answer: e.target.value }));
    setCaptchaError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Captcha validation
    if (parseInt(captcha.answer) !== captcha.a + captcha.b) {
      setCaptchaError('Captcha answer is incorrect.');
      return;
    } else {
      setCaptchaError('');
    }
    const uname = formData.username.trim();
    const pwd = formData.password;

    if (!uname || !pwd) {
      setError('Please enter both username and password.');
      return;
    }

    // Find user in localStorage (front-end demo authentication)
    const found = users.find(u => u.username.toLowerCase() === uname.toLowerCase());
    if (!found) {
      setError('Account not found. Please register first.');
      return;
    }

    if (found.password !== pwd) {
      setError('Incorrect password. Please try again.');
      return;
    }

    // If a role was selected, ensure it matches; else use stored role
    const userRole = selectedRole || found.role;
    if (selectedRole && selectedRole !== found.role) {
      setError(`You registered as ${found.role}. Please select the correct role.`);
      return;
    }

    // Login and route by role
    login(found.username, userRole);
    switch (userRole) {
      case 'student':
        navigate('/student');
        break;
      case 'faculty':
        navigate('/faculty');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="container">
      <div className="card login-card">
        <h1>Feedback Management System</h1>
        
        {!showLoginForm ? (
          <div id="roleSelection" className="role-selection">
            <h2>I am a:</h2>
            <div className="role-buttons">
              <button 
                type="button" 
                className="role-btn" 
                onClick={() => handleRoleSelection('student')}
              >
                Student
              </button>
              <button 
                type="button" 
                className="role-btn" 
                onClick={() => handleRoleSelection('faculty')}
              >
                Faculty
              </button>
              <button 
                type="button" 
                className="role-btn admin-btn" 
                onClick={() => handleRoleSelection('admin')}
              >
                Admin
              </button>
            </div>
            <div className="info-text" style={{ marginTop: 16 }}>
              <p>Don't have an account? <Link to="/register" style={{ color: '#ffd700' }}>Create one</Link></p>
            </div>
          </div>
        ) : (
          <div id="loginForm-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
                <label htmlFor="password">Password</label>
              </div>
              {error && (<p style={{ color: '#ffd700', marginTop: 8 }}>{error}</p>)}
              <div className="form-group captcha-group" style={{ marginTop: 18, marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ background: '#f5f6fa', border: '1px solid #b3b3e6', borderRadius: 8, padding: '10px 18px', fontWeight: 500, fontSize: 16, color: '#222', minWidth: 180 }}>
                    <span style={{ color: '#6e8efb', fontWeight: 700 }}>Captcha:</span> What is <span style={{ fontWeight: 700 }}>{captcha.a} + {captcha.b}</span>?
                  </div>
                  <div style={{ background: '#f5f6fa', border: '1px solid #b3b3e6', borderRadius: 8, padding: '10px 18px', display: 'flex', alignItems: 'center', minWidth: 60, justifyContent: 'center' }}>
                    <button type="button" className="btn btn-secondary" style={{ fontSize: 18, padding: '2px 10px', background: 'none', border: 'none', color: '#6e8efb', cursor: 'pointer' }} onClick={generateCaptcha} aria-label="Refresh captcha">↻</button>
                  </div>
                </div>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <input
                    type="number"
                    name="captcha"
                    value={captcha.answer}
                    onChange={handleCaptchaChange}
                    required
                    min="0"
                    style={{ width: 120, fontSize: 16, padding: '6px 10px', borderRadius: 6, border: '1px solid #b3b3e6' }}
                    aria-label="Enter captcha answer"
                    placeholder="Enter answer"
                  />
                  {captchaError && <div style={{ color: '#ff4d4f', fontWeight: 500, marginTop: 6 }}>{captchaError}</div>}
                </div>
              </div>
              <button type="submit" className="btn">Login</button>
            </form>
            <div className="info-text">
              <p>For demo purposes:</p>
              <p>- Click Faculty and login for Faculty access</p>
              <p>- Click Admin or use a username containing "admin" for Admin access</p>
              <p>- Click Student or use any other username for Student access</p>
              <p>New user? <Link to="/register" style={{ color: '#ffd700' }}>Register</Link></p>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setShowLoginForm(false);
                setSelectedRole('');
                setFormData({ username: '', password: '' });
              }}
            >
              Back to Role Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
