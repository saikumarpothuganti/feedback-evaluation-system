import React, { useState } from 'react';
import Navbar from './Navbar.jsx';

const Settings = () => {
  const [settings, setSettings] = useState({
    systemName: 'Feedback Management System',
    institutionName: 'University Name',
    academicYear: '2024-2025',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    theme: 'light',
    language: 'english',
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    dataRetention: 24,
    backupFrequency: 'daily'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        systemName: 'Feedback Management System',
        institutionName: 'University Name',
        academicYear: '2024-2025',
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: true,
        theme: 'light',
        language: 'english',
        sessionTimeout: 30,
        passwordPolicy: 'medium',
        dataRetention: 24,
        backupFrequency: 'daily'
      });
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      alert('All data has been cleared.');
    }
  };

  return (
    <div className="settings-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <div className="card settings-card">
          <h2>System Settings</h2>
          
          <div className="settings-sections">
            <div className="settings-section">
              <h3>🔧 General Settings</h3>
              <div className="form-group">
                <input 
                  type="text" 
                  name="systemName"
                  value={settings.systemName}
                  onChange={handleInputChange}
                />
                <label htmlFor="systemName">System Name:</label>
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="institutionName"
                  value={settings.institutionName}
                  onChange={handleInputChange}
                />
                <label htmlFor="institutionName">Institution Name:</label>
              </div>
              <div className="form-group">
                <select 
                  name="academicYear"
                  value={settings.academicYear}
                  onChange={handleInputChange}
                >
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                </select>
                <label htmlFor="academicYear">Current Academic Year:</label>
              </div>
            </div>

            <div className="settings-section">
              <h3>📧 Notification Settings</h3>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="emailNotifications">Email Notifications</label>
                </div>
                <div className="checkbox-item">
                  <input 
                    type="checkbox" 
                    name="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="pushNotifications">Push Notifications</label>
                </div>
                <div className="checkbox-item">
                  <input 
                    type="checkbox" 
                    name="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="smsNotifications">SMS Notifications</label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>🎨 Display Settings</h3>
              <div className="form-group">
                <select 
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
                <label htmlFor="theme">Theme:</label>
              </div>
              <div className="form-group">
                <select 
                  name="language"
                  value={settings.language}
                  onChange={handleInputChange}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
                <label htmlFor="language">Language:</label>
              </div>
            </div>

            <div className="settings-section">
              <h3>🔒 Security Settings</h3>
              <div className="form-group">
                <input 
                  type="number" 
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleInputChange}
                  min="5" 
                  max="120"
                />
                <label htmlFor="sessionTimeout">Session Timeout (minutes):</label>
              </div>
              <div className="form-group">
                <select 
                  name="passwordPolicy"
                  value={settings.passwordPolicy}
                  onChange={handleInputChange}
                >
                  <option value="low">Low Security</option>
                  <option value="medium">Medium Security</option>
                  <option value="high">High Security</option>
                </select>
                <label htmlFor="passwordPolicy">Password Policy:</label>
              </div>
            </div>

            <div className="settings-section">
              <h3>📊 Data Management</h3>
              <div className="form-group">
                <input 
                  type="number" 
                  name="dataRetention"
                  value={settings.dataRetention}
                  onChange={handleInputChange}
                  min="6" 
                  max="60"
                />
                <label htmlFor="dataRetention">Data Retention Period (months):</label>
              </div>
              <div className="form-group">
                <select 
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleInputChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <label htmlFor="backupFrequency">Backup Frequency:</label>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn" onClick={saveSettings}>Save Settings</button>
            <button className="btn btn-secondary" onClick={resetSettings}>Reset to Default</button>
            <button className="btn btn-danger" onClick={clearAllData}>Clear All Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
