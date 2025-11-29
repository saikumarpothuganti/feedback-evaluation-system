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

  // --- Analytics computations ---
  const total = feedbacks.length;
  const studentCount = feedbacks.filter(f => f.userRole === 'student').length;
  const facultyCount = feedbacks.filter(f => f.userRole === 'faculty').length;

  // Method distribution (academics / hostel / disciplinary / academic)
  const methodCounts = { academics: 0, hostel: 0, disciplinary: 0, academic: 0 };
  feedbacks.forEach(f => {
    const methodKey = (f.method || f.feedbackType || '').toLowerCase();
    if (methodCounts[methodKey] !== undefined) {
      methodCounts[methodKey]++;
    }
  });

  // Rating averages
  const ratingsAll = feedbacks.map(f => Number(f.rating)).filter(r => r >= 1 && r <= 5);
  const avgAll = ratingsAll.length ? (ratingsAll.reduce((a,b)=>a+b,0) / ratingsAll.length).toFixed(2) : 'N/A';
  const avgStudentArr = feedbacks.filter(f => f.userRole === 'student').map(f => Number(f.rating)).filter(r => r >=1 && r <=5);
  const avgFacultyArr = feedbacks.filter(f => f.userRole === 'faculty').map(f => Number(f.rating)).filter(r => r >=1 && r <=5);
  const avgStudent = avgStudentArr.length ? (avgStudentArr.reduce((a,b)=>a+b,0) / avgStudentArr.length).toFixed(2) : 'N/A';
  const avgFaculty = avgFacultyArr.length ? (avgFacultyArr.reduce((a,b)=>a+b,0) / avgFacultyArr.length).toFixed(2) : 'N/A';

  // Recent (last 7 days)
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recentCount = feedbacks.filter(f => {
    if (!f.timestamp) return false;
    return (now - new Date(f.timestamp).getTime()) <= sevenDaysMs;
  }).length;

  // Helper to percent
  const pct = (count) => total ? ((count / total) * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="admin-page">
      <Navbar />
      
      <div className="container">
        <div className="card admin-card">
          <h2>Admin Dashboard</h2>

          {/* Analytics Summary */}
          <div className="analytics-summary" style={{ marginBottom: 24 }}>
            <h3>Feedback Analytics</h3>
            <div className="analytics-grid" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
              <div className="analytic-box">
                <h4>Total</h4>
                <div className="metric-value">{total}</div>
              </div>
              <div className="analytic-box">
                <h4>Students</h4>
                <div className="metric-value">{studentCount} <span className="metric-sub">({pct(studentCount)})</span></div>
              </div>
              <div className="analytic-box">
                <h4>Faculty</h4>
                <div className="metric-value">{facultyCount} <span className="metric-sub">({pct(facultyCount)})</span></div>
              </div>
              <div className="analytic-box">
                <h4>Recent (7d)</h4>
                <div className="metric-value">{recentCount}</div>
              </div>
              <div className="analytic-box">
                <h4>Avg Rating (All)</h4>
                <div className="metric-value">{avgAll}</div>
              </div>
              <div className="analytic-box">
                <h4>Avg Rating (Students)</h4>
                <div className="metric-value">{avgStudent}</div>
              </div>
              <div className="analytic-box">
                <h4>Avg Rating (Faculty)</h4>
                <div className="metric-value">{avgFaculty}</div>
              </div>
            </div>

            {/* Method Distribution */}
            <div className="method-distribution" style={{ marginTop: 20 }}>
              <h4>Method Distribution</h4>
              <div className="method-rows" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['academics','hostel','disciplinary'].map(key => (
                  <div key={key} className="method-row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ minWidth: 100, textTransform: 'capitalize' }}>{key}</span>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: 10, borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ width: total ? (methodCounts[key] / total * 100) + '%' : '0%', height: '100%', background: key === 'academics' ? 'rgba(110,142,251,0.8)' : key === 'hostel' ? 'rgba(167,119,227,0.8)' : key === 'disciplinary' ? 'rgba(255,184,77,0.8)' : 'rgba(72,201,176,0.8)' }}></div>
                    </div>
                    <span style={{ fontSize: 12 }}>{methodCounts[key]} ({pct(methodCounts[key])})</span>
                  </div>
                ))}
              </div>
            </div>
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
                    <h4>{getFeedbackTitle(feedback)}</h4>
                    <span className={getBadgeClass(feedback.userRole)}>
                      {feedback.userRole}
                    </span>
                  </div>
                  
                  <div className="feedback-meta">
                    <span className="feedback-date">
                      {formatDate(feedback.timestamp)}
                    </span>
                    {feedback.submittedBy && (
                      <span style={{ marginLeft: 12, opacity: 0.8 }}>
                        👤 {feedback.submittedBy}
                      </span>
                    )}
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
