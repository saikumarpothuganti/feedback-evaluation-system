import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeedback } from '../context/FeedbackContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from '../hooks/useForm.js';
import Navbar from './Navbar.jsx';

const Student = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    instructorName: '',
    hostelName: '',
    floorNo: '',
    wardenName: '',
    rating: '',
    comments: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { addFeedback } = useFeedback();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const handleMethodSelection = (method) => {
    setSelectedMethod(method);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.rating || !formData.comments) {
      setError('Please provide a rating and comments.');
      return;
    }

    // Create feedback object with user info
    const feedback = {
      ...formData,
      feedbackType: selectedMethod,
      userRole: userRole,
      submittedBy: currentUser,
      method: selectedMethod
    };

    // Add feedback
    addFeedback(feedback);
    setSuccess('Feedback submitted successfully!');
    
    // Reset form
    setFormData({
      courseName: '',
      instructorName: '',
      hostelName: '',
      floorNo: '',
      wardenName: '',
      rating: '',
      comments: ''
    });
    setShowForm(false);
    setSelectedMethod('');
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedMethod('');
    setFormData({
      courseName: '',
      instructorName: '',
      hostelName: '',
      floorNo: '',
      wardenName: '',
      rating: '',
      comments: ''
    });
  };

  return (
    <div className="student-page">
      <Navbar />
      
      <div className="container">
        {!showForm ? (
          <div className="card feedback-methods-card">
            <h2>Select Feedback Method</h2>
            <div className="feedback-methods">
              <div 
                className="feedback-method" 
                onClick={() => handleMethodSelection('academics')}
              >
                <div className="method-icon">📚</div>
                <h3>Academics</h3>
                <p>Provide feedback about courses, instructors, and academic resources</p>
              </div>
              <div 
                className="feedback-method" 
                onClick={() => handleMethodSelection('hostel')}
              >
                <div className="method-icon">🏠</div>
                <h3>Hostel</h3>
                <p>Provide feedback about hostel facilities and accommodation</p>
              </div>
              <div 
                className="feedback-method" 
                onClick={() => handleMethodSelection('disciplinary')}
              >
                <div className="method-icon">⚖️</div>
                <h3>Disciplinary</h3>
                <p>Provide feedback about campus rules, discipline, and conduct</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card feedback-card">
            <h2>Submit Course Feedback</h2>
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: '#ffd700' }}>{error}</p>}
              {success && <p style={{ color: '#6efb8e' }}>{success}</p>}
              {selectedMethod === 'academics' && (
                <div className="academic-fields">
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="courseName">Course Name</label>
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="instructorName"
                      value={formData.instructorName}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="instructorName">Instructor Name</label>
                  </div>
                </div>
              )}
              
              {selectedMethod === 'hostel' && (
                <div className="hostel-fields">
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="hostelName"
                      value={formData.hostelName}
                      onChange={handleInputChange}
                      placeholder="e.g., A Block"
                    />
                    <label htmlFor="hostelName">Hostel Name</label>
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="floorNo"
                      value={formData.floorNo}
                      onChange={handleInputChange}
                      placeholder="e.g., 2nd Floor"
                    />
                    <label htmlFor="floorNo">Floor No</label>
                  </div>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="wardenName"
                      value={formData.wardenName}
                      onChange={handleInputChange}
                      placeholder="e.g., Mr. Sharma"
                    />
                    <label htmlFor="wardenName">Warden Name</label>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label className="rating-label">Rating (1–5)</label>
                <div className="rating-scale">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num} className="scale-item">
                      <input 
                        type="radio" 
                        id={`rate${num}`}
                        name="rating" 
                        value={num}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor={`rate${num}`}>{num}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <textarea 
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  rows="4" 
                  required 
                  placeholder="Write your comments..."
                />
                <label htmlFor="comments">Comments</label>
              </div>
              
              <div className="form-buttons">
                <button type="button" className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" className="btn">Submit Feedback</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
