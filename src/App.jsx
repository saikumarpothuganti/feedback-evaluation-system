import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { FeedbackProvider } from './context/FeedbackContext.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Student from './components/Student.jsx';
import Faculty from './components/Faculty.jsx';
import Admin from './components/Admin.jsx';
import Reports from './components/Reports.jsx';
import Profile from './components/Profile.jsx';
import Settings from './components/Settings.jsx';
import Notifications from './components/Notifications.jsx';
import Help from './components/Help.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Student />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/faculty" 
                element={
                  <ProtectedRoute requiredRole="faculty">
                    <Faculty />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/help" 
                element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;
