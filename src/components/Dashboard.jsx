import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';

const Dashboard = () => {
  const { getFeedbackStats } = useFeedback();
  const { currentUser, userRole } = useAuth();
  
  const stats = getFeedbackStats();

  return (
    <div className="dashboard-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <div className="card dashboard-card">
          <h2>Welcome to Feedback Management System</h2>
          {currentUser && (
            <p>Hello, {currentUser}! You are logged in as {userRole}.</p>
          )}
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Feedback</h3>
              <div className="stat-number">{stats.total}</div>
            </div>
            <div className="stat-card">
              <h3>Student Feedback</h3>
              <div className="stat-number">{stats.studentFeedback}</div>
            </div>
            <div className="stat-card">
              <h3>Faculty Feedback</h3>
              <div className="stat-number">{stats.facultyFeedback}</div>
            </div>
            <div className="stat-card">
              <h3>This Month</h3>
              <div className="stat-number">{stats.monthlyFeedback}</div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/student" className="action-btn">
                <div className="action-icon">📝</div>
                <span>Submit Feedback</span>
              </Link>
              <Link to="/admin" className="action-btn">
                <div className="action-icon">📊</div>
                <span>View Reports</span>
              </Link>
              <Link to="/reports" className="action-btn">
                <div className="action-icon">📈</div>
                <span>Analytics</span>
              </Link>
              <Link to="/settings" className="action-btn">
                <div className="action-icon">⚙️</div>
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
