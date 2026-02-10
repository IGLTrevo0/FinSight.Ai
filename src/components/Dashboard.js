// src/components/Dashboard.js - ENHANCED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components for rendering charts
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  // Button to clear summary data from localStorage and state
  <button
  onClick={() => {
    localStorage.removeItem("finsight_result");
    setSummary(null);
  }}
  className="btn-generate"
>
  Clear Summary
</button>
  // Hook for navigation between pages
  const navigate = useNavigate();
  // State to hold the summary data from analysis
  const [summary, setSummary] = useState(null);
  // Effect to load summary from localStorage on mount
  useEffect(() => {
  const summaryText = loadSummaryFromLocalStorage();

  if (summaryText) {
    setSummary({ summary: summaryText });
    setError(""); // remove red error banner
  }
}, []);
  // Effect to load and parse summary data from localStorage
  useEffect(() => {
     
  try {
    const saved = localStorage.getItem("finsight_result");
    if (saved) {
      setSummary(JSON.parse(saved));
    }
  } catch (e) {
    console.error("Failed to read finsight_result from localStorage:", e);
  }
}, []);
  // State for loading indicator during API calls
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');


  // Webhook URL for N8N integration
  const N8N_WEBHOOK = 'https://n8n.srv1333057.hstgr.cloud/webhook/finsight-upload';

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedData = localStorage.getItem("finsight_result");
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Loaded data from localStorage:", parsedData);
          setSummary(parsedData);
        } else {
          console.log("No stored data found in localStorage");
        }
      } catch (err) {
        console.error("Error loading stored data:", err);
        setError("Error loading saved data");
      }
    };

    loadStoredData();
  }, []);

// Function to fetch summary data from the N8N webhook
const fetchSummary = async () => {
  // Set loading state to true
  setLoading(true);
  // Clear any previous error messages
  setError('');

  try {
    // Make POST request to N8N webhook for summary
    const response = await fetch('https://n8n.srv1333057.hstgr.cloud/webhook-test/finsight-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "get-summary"
      })
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }

    // Parse JSON response
    const data = await response.json();
    console.log('Got data:', data);
    
    // Update state with fetched data
    setSummary(data);
    // Store data in localStorage for persistence
    localStorage.setItem("finsight_result", JSON.stringify(data));

  } catch (err) {
    console.error('Error:', err);
    // Set error message for user
    setError('Failed to generate summary. Please try again.');
  } finally {
    // Always set loading to false when done
    setLoading(false);
  }
};

  // Chart configurations with dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 500
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Prepare chart data with fallback for different data structures
  const vendorChartData = summary?.vendorTotals ? {
    labels: summary.vendorTotals.map(v => v.vendor || v.name || 'Unknown'),
    datasets: [{
      label: 'Total Spent ($)',
      data: summary.vendorTotals.map(v => v.total || v.amount || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 6,
    }],
  } : null;

  const dateChartData = summary?.dateTrends ? {
    labels: summary.dateTrends.map(d => d.date || d.period || 'N/A'),
    datasets: [{
      label: 'Daily Spending ($)',
      data: summary.dateTrends.map(d => d.amount || d.value || 0),
      borderColor: 'rgba(168, 85, 247, 1)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(168, 85, 247, 1)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  } : null;

  const categoryChartData = summary?.categoryBreakdown ? {
    labels: summary.categoryBreakdown.map(c => c.category || c.name || 'Other'),
    datasets: [{
      data: summary.categoryBreakdown.map(c => c.amount || c.value || 0),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: '#1a1f35',
      borderWidth: 2,
    }],
  } : null;
  function loadSummaryFromLocalStorage() {
  try {
    const raw = localStorage.getItem("finsight_result");

    if (!raw) {
      console.log("No summary in localStorage");
      return null;
    }

    const parsed = JSON.parse(raw);
    console.log("Loaded summary from localStorage:", parsed);

    // Handle all possible shapes
    if (typeof parsed === "string") return parsed;
    if (parsed.summary) return parsed.summary;
    if (parsed.human_summary) return parsed.human_summary;
    if (parsed.textSummary) return parsed.textSummary;

    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    console.error("Failed to load summary:", err);
    return "Error reading summary from local storage";
  }
}

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Financial Intelligence Dashboard</h1>
            <p className="dashboard-subtitle">
              {summary ? 'AI-powered insights from your documents' : 'Upload documents to get started'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/upload')}
              className="btn-secondary"
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload More
            </button>
            
            <button
              onClick={fetchSummary}
              disabled={loading}
              className="btn-generate"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="generate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Refresh Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="dashboard-error">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      
        {/* Summary Results */}
        {summary && (
          <div className="dashboard-results">
            {/* Key Metrics Cards */}
            {/* <div className="metrics-row">
              <div className="metric-box">
                <div className="metric-icon-wrapper purple">
                  <svg className="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="metric-content">
                  <p className="metric-label">Total Documents</p>
                  <p className="metric-number">{summary.totalDocuments || summary.total_documents || 0}</p>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon-wrapper green">
                  <svg className="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="metric-content">
                  <p className="metric-label">Total Spending</p>
                  <p className="metric-number">${(summary.totalSpending || summary.total_spending || 0).toLocaleString()}</p>
                </div>
              </div> */}

              {/* <div className="metric-box">
                <div className="metric-icon-wrapper orange">
                  <svg className="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="metric-content">
                  <p className="metric-label">Total Tax</p>
                  <p className="metric-number">${(summary.totalTax || summary.total_tax || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon-wrapper blue">
                  <svg className="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="metric-content">
                  <p className="metric-label">Unique Vendors</p>
                  <p className="metric-number">{summary.uniqueVendors || summary.unique_vendors || 0}</p>
                </div>
              </div> */}
            {/* </div> */}

            {/* Executive Summary */}
            <div className="summary-card-large">
              <h2 className="section-title">
                <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Executive Summary
              </h2>
              <div className="summary-text">
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  
                  {(summary?.textSummary ||
  summary?.human_summary ||
  summary?.summary ||
  summary?.summary?.textSummary ||
  summary?.summary?.human_summary ||
  'Your AI-generated executive summary will appear here.')}
                </p>
              </div>
            </div>
                
            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Vendor Chart */}
              {vendorChartData && (
                <div className="chart-card">
                  <h2 className="section-title">
                    <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Vendor-wise Spending
                  </h2>
                  <div className="chart-wrapper">
                    <Bar data={vendorChartData} options={chartOptions} />
                  </div>
                </div>
              )}

              {/* Date Trend Chart */}
              {dateChartData && (
                <div className="chart-card">
                  <h2 className="section-title">
                    <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Spending Trend Over Time
                  </h2>
                  <div className="chart-wrapper">
                    <Line data={dateChartData} options={chartOptions} />
                  </div>
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            {categoryChartData && (
              <div className="category-section">
                <div className="chart-card-half">
                  <h2 className="section-title">
                    <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Category Distribution
                  </h2>
                  <div className="chart-wrapper-doughnut">
                    <Doughnut data={categoryChartData} options={doughnutOptions} />
                  </div>
                </div>

                <div className="category-list-card">
                  <h2 className="section-title">
                    <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Category Breakdown
                  </h2>
                  <div className="category-items">
                    {summary.categoryBreakdown?.map((cat, idx) => (
                      <div key={idx} className="category-row">
                        <div className="category-info">
                          <div 
                            className="category-color" 
                            style={{ 
                              backgroundColor: categoryChartData.datasets[0].backgroundColor[idx % categoryChartData.datasets[0].backgroundColor.length] 
                            }}
                          ></div>
                          <span className="category-text">{cat.category || cat.name || 'Other'}</span>
                        </div>
                        <span className="category-value">${(cat.amount || cat.value || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!summary && !loading && !error && (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 className="empty-title">No Documents Uploaded Yet</h3>
            <p className="empty-text">Upload your financial documents to see AI-powered insights and analytics</p>
            <button
              onClick={() => navigate('/upload')}
              className="btn-upload-cta"
              style={{ 
                marginTop: '20px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Documents
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;