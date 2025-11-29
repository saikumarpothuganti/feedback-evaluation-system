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

  const handleSubmit = (e) => {
    e.preventDefault();
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
