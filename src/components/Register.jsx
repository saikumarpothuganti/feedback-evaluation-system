// filepath: d:\\Frontend Development and Frameworks\\Project Files\\src\\components\\Register.jsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const USERS_KEY = 'registeredUsers';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const users = useMemo(() => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.username.trim()) e.username = 'Username is required';
    else if (users.some(u => u.username.toLowerCase() === form.username.toLowerCase())) e.username = 'Username already exists';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Use at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!['student','faculty','admin'].includes(form.role)) e.role = 'Select a valid role';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const nextUsers = [...users, {
        id: Date.now(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password, // Demo only; do NOT store plain text in real apps
        role: form.role,
        createdAt: new Date().toISOString(),
      }];
      localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

      // Auto-login and go to role page
      login(form.username.trim(), form.role);
      switch (form.role) {
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card login-card">
        <h1>Feedback Management System</h1>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <label htmlFor="fullName">Full Name</label>
            {errors.fullName && <small style={{color:'#ffd700'}}>{errors.fullName}</small>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
            {errors.email && <small style={{color:'#ffd700'}}>{errors.email}</small>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Username</label>
            {errors.username && <small style={{color:'#ffd700'}}>{errors.username}</small>}
          </div>

          <div className="form-group">
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role">Role</label>
            {errors.role && <small style={{color:'#ffd700'}}>{errors.role}</small>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            {errors.password && <small style={{color:'#ffd700'}}>{errors.password}</small>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            {errors.confirmPassword && <small style={{color:'#ffd700'}}>{errors.confirmPassword}</small>}
          </div>

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="info-text" style={{ marginTop: 16 }}>
          <p>Already have an account? <Link to="/login" style={{ color: '#ffd700' }}>Login</Link></p>
          <p style={{ opacity: 0.8 }}>Note: This is a demo. Accounts are stored in your browser (localStorage).</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
