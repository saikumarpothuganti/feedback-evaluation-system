import React, { useState, useEffect } from 'react';
import { useFeedback } from '../context/FeedbackContext.jsx';
import Navbar from './Navbar.jsx';

const Admin = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]);
  
  const { feedbacks, getFilteredFeedbacks, deleteFeedback } = useFeedback();

  useEffect(() => {
    setDisplayedFeedbacks(getFilteredFeedbacks(activeFilter));
  }, [feedbacks, activeFilter, getFilteredFeedbacks]);

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

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="container">
        <div className="card admin-card">
          <h2>Admin Dashboard</h2>
          
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
                    <h4>{getFeedbackTitle(feedback)}</h4>
                    <span className={getBadgeClass(feedback.userRole)}>
                      {feedback.userRole}
                    </span>
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

                  <div className="feedback-actions" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm('Delete this feedback? This action cannot be undone.')) {
                          deleteFeedback(feedback.id);
                        }
                      }}
                    >
                      Delete
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
