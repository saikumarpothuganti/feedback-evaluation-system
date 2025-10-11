import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowLoginForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    // Determine user role based on selection and username
    let userRole = selectedRole;
    if (formData.username.toLowerCase().includes('admin')) {
      userRole = 'admin';
    }

    // Login user
    login(formData.username, userRole);

    // Redirect based on role
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
              <button type="submit" className="btn">Login</button>
            </form>
            <div className="info-text">
              <p>For demo purposes:</p>
              <p>- Click Faculty and login for Faculty access</p>
              <p>- Click Admin or use a username containing "admin" for Admin access</p>
              <p>- Click Student or use any other username for Student access</p>
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
