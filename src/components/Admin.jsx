import React, { useState, useEffect } from 'react';
import { useFeedback } from '../context/FeedbackContext.jsx';
import Navbar from './Navbar.jsx';
import * as FeedbackDB from '../utils/feedbackDB.js';

const Admin = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const { feedbacks, getFilteredFeedbacks } = useFeedback();

  useEffect(() => {
    loadData();
  }, [feedbacks, activeFilter, searchTerm]);

  const loadData = () => {
    const dbStats = FeedbackDB.getFeedbackStats();
    setStats(dbStats);
    
    let filtered = getFilteredFeedbacks(activeFilter);
    
    if (searchTerm.trim()) {
      filtered = FeedbackDB.searchFeedbacks(searchTerm);
      if (activeFilter !== 'all') {
        filtered = filtered.filter(f => f.userRole === activeFilter);
      }
    }
    
    setDisplayedFeedbacks(filtered);
  };

  const handleStatusUpdate = (feedbackId, newStatus) => {
    FeedbackDB.updateFeedback(feedbackId, { status: newStatus });
    loadData();
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      FeedbackDB.deleteFeedback(feedbackId);
      loadData();
    }
  };

  const handleExport = () => {
    const jsonData = FeedbackDB.exportFeedbacks();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= numRating ? 'filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleDateString();
  };

  const getBadgeClass = (role) => {
    return `badge ${role}`;
  };

  const getFeedbackTitle = (feedback) => {
    switch (feedback.feedbackType || feedback.method) {
      case 'academics':
        return feedback.courseName || 'Academic Feedback';
      case 'hostel':
        return feedback.hostelName || 'Hostel Feedback';
      case 'disciplinary':
        return 'Disciplinary Feedback';
      case 'academic':
        return feedback.subjectName || 'Faculty Academic Feedback';
      default:
        return 'General Feedback';
    }
  };

  const getFeedbackSubtitle = (feedback) => {
    switch (feedback.feedbackType || feedback.method) {
      case 'academics':
        return feedback.instructorName ? `Instructor: ${feedback.instructorName}` : '';
      case 'hostel':
        return feedback.floorNo ? `Floor: ${feedback.floorNo}` : '';
      case 'academic':
        return feedback.departmentName ? `Department: ${feedback.departmentName}` : '';
      default:
        return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'resolved': return 'status-badge resolved';
      case 'reviewed': return 'status-badge reviewed';
      default: return 'status-badge pending';
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="container">
        <div className="card admin-card">
          <h2>Admin Dashboard</h2>
          
          {/* Stats Overview */}
          {stats && (
            <div className="stats-overview">
              <div className="stat-card">
                <h3>{stats.total}</h3>
                <p>Total Feedbacks</p>
              </div>
              <div className="stat-card">
                <h3>{stats.byStatus?.pending || 0}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-card">
                <h3>{stats.byStatus?.reviewed || 0}</h3>
                <p>Reviewed</p>
              </div>
              <div className="stat-card">
                <h3>{stats.byStatus?.resolved || 0}</h3>
                <p>Resolved</p>
              </div>
              <div className="stat-card">
                <h3>{stats.avgRating?.toFixed(1) || 'N/A'}</h3>
                <p>Avg Rating</p>
              </div>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search feedbacks by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleExport} className="btn export-btn">
              📥 Export Data
            </button>
          </div>
          <div className="dashboard-header">
            <h3>Feedback Submissions</h3>
            <div className="filter-options">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Feedback
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'student' ? 'active' : ''}`}
                onClick={() => handleFilterChange('student')}
              >
                Student Feedback
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'faculty' ? 'active' : ''}`}
                onClick={() => handleFilterChange('faculty')}
              >
                Faculty Feedback
              </button>
            </div>
          </div>
          
          <div className="feedback-list">
            {displayedFeedbacks.length === 0 ? (
              <div className="no-feedback-message">No feedback available</div>
            ) : (
              displayedFeedbacks.map((feedback) => (
                <div key={feedback.id} className="feedback-item">
                  <div className="feedback-header">
                    <div>
                      <h4>{getFeedbackTitle(feedback)}</h4>
                      <div className="feedback-badges">
                        <span className={getBadgeClass(feedback.userRole)}>
                          {feedback.userRole}
                        </span>
                        <span className={getStatusBadgeClass(feedback.status || 'pending')}>
                          {feedback.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="feedback-meta">
                    <span className="feedback-date">
                      {formatDate(feedback.timestamp)}
                    </span>
                    {feedback.rating && (
                      <div className="feedback-rating">
                        {renderStars(feedback.rating)}
                      </div>
                    )}
                  </div>
                  
                  {getFeedbackSubtitle(feedback) && (
                    <p className="feedback-subtitle">
                      {getFeedbackSubtitle(feedback)}
                    </p>
                  )}
                  
                  {feedback.comments && (
                    <div className="feedback-comment">
                      <strong>Comments:</strong> {feedback.comments}
                    </div>
                  )}
                  
                  {feedback.suggestions && (
                    <div className="feedback-comment">
                      <strong>Suggestions:</strong> {feedback.suggestions}
                    </div>
                  )}
                  
                  {feedback.outcomes && (
                    <div className="feedback-comment">
                      <strong>Expected Outcomes:</strong> {feedback.outcomes}
                    </div>
                  )}
                  
                  {feedback.academicYear && (
                    <div className="feedback-meta">
                      <span>Academic Year: {feedback.academicYear}</span>
                      {feedback.semester && (
                        <span> | Semester: {feedback.semester}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="feedback-actions">
                    <select 
                      value={feedback.status || 'pending'}
                      onChange={(e) => handleStatusUpdate(feedback.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(feedback.id)}
                      className="btn delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
