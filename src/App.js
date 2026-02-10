// src/App.js
// Main application component that sets up routing for the entire app
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';

import './styles.css';

// Main App component that defines the routing structure
function App() {
  return (
    // Wrap the app in BrowserRouter to enable client-side routing
    <Router>
      <div className="App">
        {/* Define all the routes for the application */}
        <Routes>
          {/* Redirect root path to login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Route for login page */}
          <Route path="/login" element={<LoginPage />} />
          {/* Route for upload page */}
          <Route path="/upload" element={<UploadPage />} />
          {/* Route for dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Route for profile page */}
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
