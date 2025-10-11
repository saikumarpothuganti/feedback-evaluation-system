import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';

const Faculty = () => {
  const [formData, setFormData] = useState({
    departmentName: '',
    subjectName: '',
    academicYear: '',
    semester: '',
    suggestions: '',
    outcomes: ''
  });

  const { addFeedback } = useFeedback();
  const { userRole } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.departmentName || !formData.subjectName || !formData.academicYear || 
        !formData.semester || !formData.suggestions || !formData.outcomes) {
      alert('Please fill in all fields');
      return;
    }

    // Create feedback object
    const feedback = {
      ...formData,
      feedbackType: 'academic',
      userRole: userRole,
      method: 'faculty'
    };

    // Add feedback
    addFeedback(feedback);
    
    alert('Academic feedback submitted successfully!');
    
    // Reset form
    setFormData({
      departmentName: '',
      subjectName: '',
      academicYear: '',
      semester: '',
      suggestions: '',
      outcomes: ''
    });
  };

  return (
    <div className="faculty-page">
      <Navbar />
      
      <div className="container">
        <div className="card feedback-card">
          <h2>Submit Academic Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                required 
              />
              <label htmlFor="departmentName">Department Name</label>
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="subjectName"
                value={formData.subjectName}
                onChange={handleInputChange}
                required 
              />
              <label htmlFor="subjectName">Subject Name</label>
            </div>
            
            <div className="form-group">
              <select 
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Academic Year</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2021-2022">2021-2022</option>
              </select>
            </div>
            
            <div className="form-group">
              <select 
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            
            <div className="form-group">
              <textarea 
                name="suggestions"
                value={formData.suggestions}
                onChange={handleInputChange}
                rows="4" 
                required 
              />
              <label htmlFor="suggestions">Detailed Suggestions</label>
            </div>
            
            <div className="form-group">
              <textarea 
                name="outcomes"
                value={formData.outcomes}
                onChange={handleInputChange}
                rows="4" 
                required 
              />
              <label htmlFor="outcomes">Expected Learning Outcomes</label>
            </div>
            
            <button type="submit" className="btn">Submit Academic Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Faculty;
