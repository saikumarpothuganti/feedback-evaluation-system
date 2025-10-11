import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';

const Profile = () => {
  const { currentUser, userRole } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    studentId: 'STU2024001',
    department: 'Computer Science',
    program: 'Bachelor of Science',
    year: '3rd Year',
    semester: 'Fall 2024'
  });

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    alert('Profile saved successfully!');
  };

  const resetProfile = () => {
    setProfileData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@university.edu',
      phone: '+1 (555) 123-4567',
      studentId: 'STU2024001',
      department: 'Computer Science',
      program: 'Bachelor of Science',
      year: '3rd Year',
      semester: 'Fall 2024'
    });
  };

  const changePassword = () => {
    alert('Password change functionality would be implemented here.');
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion functionality would be implemented here.');
    }
  };

  return (
    <div className="profile-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <div className="card profile-card">
          <h2>User Profile</h2>
          
          <div className="profile-sections">
            <div className="profile-section">
              <h3>👤 Personal Information</h3>
              <div className="profile-form">
                <div className="form-group">
                  <input 
                    type="text" 
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                  <label htmlFor="firstName">First Name</label>
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                  <label htmlFor="lastName">Last Name</label>
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    required 
                  />
                  <label htmlFor="email">Email Address</label>
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="phone">Phone Number</label>
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="studentId"
                    value={profileData.studentId}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="studentId">Student/Faculty ID</label>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>🎓 Academic Information</h3>
              <div className="profile-form">
                <div className="form-group">
                  <input 
                    type="text" 
                    name="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="department">Department</label>
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="program"
                    value={profileData.program}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="program">Program</label>
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="year"
                    value={profileData.year}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="year">Academic Year</label>
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="semester"
                    value={profileData.semester}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="semester">Current Semester</label>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>🔐 Security Settings</h3>
              <div className="profile-form">
                <button className="btn btn-secondary" onClick={changePassword}>
                  Change Password
                </button>
              </div>
            </div>

            <div className="profile-section">
              <h3>📊 Activity Summary</h3>
              <div className="activity-stats">
                <div className="stat-item">
                  <h4>Feedback Submitted</h4>
                  <span className="stat-value">12</span>
                </div>
                <div className="stat-item">
                  <h4>Last Activity</h4>
                  <span className="stat-value">2 days ago</span>
                </div>
                <div className="stat-item">
                  <h4>Account Created</h4>
                  <span className="stat-value">Jan 2024</span>
                </div>
                <div className="stat-item">
                  <h4>Role</h4>
                  <span className="stat-value">{userRole}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn" onClick={saveProfile}>Save Changes</button>
            <button className="btn btn-secondary" onClick={resetProfile}>Reset</button>
            <button className="btn btn-danger" onClick={deleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
