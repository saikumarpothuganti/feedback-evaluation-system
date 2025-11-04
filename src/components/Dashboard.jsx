import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useFeedback } from '../context/FeedbackContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import Navbar from './Navbar.jsx';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { getFeedbackStats, feedback } = useFeedback();
  const { currentUser, userRole } = useAuth();
  const [quote, setQuote] = useState({ text: 'Education is the most powerful weapon...', author: 'Nelson Mandela' });
  
  // Fetch motivational quote from API (API Integration rubric)
  const { data: quoteData, loading: quoteLoading } = useFetch('https://api.quotable.io/random?tags=education');
  
  useEffect(() => {
    if (quoteData) {
      setQuote({ text: quoteData.content, author: quoteData.author });
    }
  }, [quoteData]);
  
  const stats = getFeedbackStats();

  // Prepare chart data
  const pieData = {
    labels: ['Student Feedback', 'Faculty Feedback'],
    datasets: [{
      data: [stats.studentFeedback, stats.facultyFeedback],
      backgroundColor: ['rgba(110, 142, 251, 0.8)', 'rgba(167, 119, 227, 0.8)'],
      borderColor: ['rgba(110, 142, 251, 1)', 'rgba(167, 119, 227, 1)'],
      borderWidth: 2,
    }]
  };

  // Rating distribution
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedback.forEach(fb => {
    if (fb.rating >= 1 && fb.rating <= 5) {
      ratingCounts[fb.rating]++;
    }
  });

  const barData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      label: 'Rating Distribution',
      data: [ratingCounts[1], ratingCounts[2], ratingCounts[3], ratingCounts[4], ratingCounts[5]],
      backgroundColor: 'rgba(110, 142, 251, 0.6)',
      borderColor: 'rgba(110, 142, 251, 1)',
      borderWidth: 1,
    }]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="dashboard-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <motion.div 
          className="card dashboard-card"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants}>Welcome to Feedback Management System</motion.h2>
          {currentUser && (
            <motion.p variants={itemVariants}>Hello, {currentUser}! You are logged in as <strong>{userRole}</strong>.</motion.p>
          )}
          
          {/* Motivational Quote - API Integration */}
          <motion.div className="quote-card" variants={itemVariants}>
            {quoteLoading ? (
              <p className="loading">Loading inspiration...</p>
            ) : (
              <>
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">— {quote.author}</p>
              </>
            )}
          </motion.div>
          
          <motion.div className="dashboard-stats" variants={itemVariants}>
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
          </motion.div>

          {/* Charts - Advanced Feature */}
          {stats.total > 0 && (
            <motion.div className="charts-container" variants={itemVariants}>
              <div className="chart-wrapper">
                <h3>Feedback Distribution</h3>
                <Pie data={pieData} options={{ maintainAspectRatio: true, responsive: true }} />
              </div>
              <div className="chart-wrapper">
                <h3>Rating Distribution</h3>
                <Bar data={barData} options={{ maintainAspectRatio: true, responsive: true, scales: { y: { beginAtZero: true } } }} />
              </div>
            </motion.div>
          )}
          
          <motion.div className="quick-actions" variants={itemVariants}>
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
