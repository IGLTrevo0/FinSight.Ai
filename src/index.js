import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create the root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component wrapped in StrictMode for development warnings
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
