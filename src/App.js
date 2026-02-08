// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Login page - no authentication, just UI */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Upload page - sends files to n8n */}
          <Route path="/upload" element={<UploadPage />} />
          
          {/* Dashboard - fetches AI summaries from n8n */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;