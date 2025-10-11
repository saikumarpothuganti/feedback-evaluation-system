import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext.jsx';
import Navbar from './Navbar.jsx';

const Reports = () => {
  const [filters, setFilters] = useState({
    timePeriod: '30',
    feedbackType: 'all',
    roleFilter: 'all'
  });

  const { feedbacks, getFeedbackStats } = useFeedback();
  const stats = getFeedbackStats();

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const generateReport = () => {
    alert('Report generated successfully!');
  };

  const exportToPDF = () => {
    alert('Exporting to PDF...');
  };

  const exportToExcel = () => {
    alert('Exporting to Excel...');
  };

  const printReport = () => {
    window.print();
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(feedback => {
      if (feedback.rating) {
        distribution[feedback.rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="reports-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <div className="card reports-card">
          <h2>Feedback Analytics & Reports</h2>
          
          <div className="report-filters">
            <div className="filter-group">
              <label>Time Period:</label>
              <select name="timePeriod" value={filters.timePeriod} onChange={handleFilterChange}>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Feedback Type:</label>
              <select name="feedbackType" value={filters.feedbackType} onChange={handleFilterChange}>
                <option value="all">All Types</option>
                <option value="academics">Academics</option>
                <option value="hostel">Hostel</option>
                <option value="disciplinary">Disciplinary</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Role:</label>
              <select name="roleFilter" value={filters.roleFilter} onChange={handleFilterChange}>
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <button className="btn" onClick={generateReport}>Generate Report</button>
          </div>

          <div className="report-sections">
            <div className="report-section">
              <h3>📊 Summary Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <h4>Total Feedback</h4>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-item">
                  <h4>Student Feedback</h4>
                  <span className="stat-value">{stats.studentFeedback}</span>
                </div>
                <div className="stat-item">
                  <h4>Faculty Feedback</h4>
                  <span className="stat-value">{stats.facultyFeedback}</span>
                </div>
                <div className="stat-item">
                  <h4>This Month</h4>
                  <span className="stat-value">{stats.monthlyFeedback}</span>
                </div>
              </div>
            </div>

            <div className="report-section">
              <h3>📈 Rating Distribution</h3>
              <div className="chart-container">
                {Object.entries(ratingDistribution).map(([rating, count]) => (
                  <div key={rating} className="rating-bar">
                    <span className="rating-label">{rating} Star</span>
                    <div className="bar-container">
                      <div 
                        className="bar" 
                        style={{width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span className="rating-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-section">
              <h3>🏆 Recent Feedback</h3>
              <div className="issues-list">
                {feedbacks.slice(-5).reverse().map((feedback, index) => (
                  <div key={feedback.id || index} className="issue-item">
                    <h4>{feedback.courseName || feedback.subjectName || 'General Feedback'}</h4>
                    <p>{feedback.comments || feedback.suggestions}</p>
                    <span className="issue-meta">
                      {feedback.userRole} - {new Date(feedback.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="export-options">
            <button className="btn btn-secondary" onClick={exportToPDF}>Export PDF</button>
            <button className="btn btn-secondary" onClick={exportToExcel}>Export Excel</button>
            <button className="btn btn-secondary" onClick={printReport}>Print Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
