import React, { useState } from 'react';
import Navbar from './Navbar.jsx';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'feedback',
      title: 'New Feedback Submitted',
      message: 'A student submitted academic feedback for "Computer Science 101"',
      time: '2 minutes ago',
      unread: true,
      icon: '📝'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Low Rating Alert',
      message: 'Hostel feedback received with rating 2/5 - requires attention',
      time: '1 hour ago',
      unread: true,
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
      time: '3 hours ago',
      unread: false,
      icon: '🔧'
    },
    {
      id: 4,
      type: 'report',
      title: 'Monthly Report Ready',
      message: 'Your monthly feedback report is ready for download',
      time: '1 day ago',
      unread: false,
      icon: '📊'
    }
  ]);

  const [preferences, setPreferences] = useState({
    newFeedback: true,
    lowRatings: true,
    systemUpdates: false,
    monthlyReports: true
  });

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const viewFeedback = (notificationId) => {
    alert(`Viewing feedback for notification ${notificationId}`);
    markAsRead(notificationId);
  };

  const downloadReport = (notificationId) => {
    alert('Downloading report...');
    markAsRead(notificationId);
  };

  const handlePreferenceChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked
    });
  };

  const saveNotificationPreferences = () => {
    alert('Notification preferences saved successfully!');
  };

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(notif => notif.unread);
      case 'important':
        return notifications.filter(notif => notif.type === 'alert');
      case 'system':
        return notifications.filter(notif => notif.type === 'system');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notifications-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <div className="card notifications-card">
          <h2>Notifications & Alerts</h2>
          
          <div className="notification-filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
              onClick={() => handleFilterChange('unread')}
            >
              Unread
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'important' ? 'active' : ''}`}
              onClick={() => handleFilterChange('important')}
            >
              Important
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'system' ? 'active' : ''}`}
              onClick={() => handleFilterChange('system')}
            >
              System
            </button>
            <button className="btn btn-secondary" onClick={markAllAsRead}>
              Mark All as Read
            </button>
          </div>

          <div className="notifications-list">
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.unread ? 'unread' : ''} ${notification.type}`}
              >
                <div className="notification-icon">{notification.icon}</div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <div className="notification-actions">
                  {notification.type === 'feedback' && (
                    <button 
                      className="btn-small" 
                      onClick={() => viewFeedback(notification.id)}
                    >
                      View
                    </button>
                  )}
                  {notification.type === 'report' && (
                    <button 
                      className="btn-small" 
                      onClick={() => downloadReport(notification.id)}
                    >
                      Download
                    </button>
                  )}
                  <button 
                    className="btn-small btn-secondary" 
                    onClick={() => markAsRead(notification.id)}
                  >
                    {notification.unread ? 'Mark Read' : 'Dismiss'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="notification-settings">
            <h3>Notification Preferences</h3>
            <div className="preference-group">
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="newFeedback"
                  checked={preferences.newFeedback}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="newFeedback">New Feedback Submissions</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="lowRatings"
                  checked={preferences.lowRatings}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="lowRatings">Low Rating Alerts</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="systemUpdates"
                  checked={preferences.systemUpdates}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="systemUpdates">System Updates</label>
              </div>
              <div className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="monthlyReports"
                  checked={preferences.monthlyReports}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor="monthlyReports">Monthly Reports</label>
              </div>
            </div>
            <button className="btn" onClick={saveNotificationPreferences}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
