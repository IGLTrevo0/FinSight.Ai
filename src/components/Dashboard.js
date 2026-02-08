// src/components/Dashboard.js
import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const N8N_SUMMARY_WEBHOOK = 'https://n8n.srv1333057.hstgr.cloud/webhook-test/finsight-summary';

  // Fetch AI summary from n8n
  const fetchSummary = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(N8N_SUMMARY_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('user') || 'demo-user',
          queries: [
            'total_by_vendor',
            'total_tax',
            'date_wise_trend',
            'category_breakdown'
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data);

    } catch (err) {
      console.error('Summary error:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
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
        borderWidth: 1
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
        borderWidth: 1
      }
    }
  };

  // Prepare chart data
  const vendorChartData = summary?.vendorTotals ? {
    labels: summary.vendorTotals.map(v => v.vendor),
    datasets: [{
      label: 'Total Spent ($)',
      data: summary.vendorTotals.map(v => v.total),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 6,
    }],
  } : null;

  const dateChartData = summary?.dateTrends ? {
    labels: summary.dateTrends.map(d => d.date),
    datasets: [{
      label: 'Daily Spending ($)',
      data: summary.dateTrends.map(d => d.amount),
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
    labels: summary.categoryBreakdown.map(c => c.category),
    datasets: [{
      data: summary.categoryBreakdown.map(c => c.amount),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
      ],
      borderColor: '#1a1f35',
      borderWidth: 2,
    }],
  } : null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Financial Intelligence Dashboard</h1>
            <p className="dashboard-subtitle">AI-powered insights from your documents</p>
          </div>
          
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
                Generate AI Summary
              </>
            )}
          </button>
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
            <div className="metrics-row">
              <div className="metric-box">
                <div className="metric-icon-wrapper purple">
                  <svg className="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="metric-content">
                  <p className="metric-label">Total Documents</p>
                  <p className="metric-number">{summary.totalDocuments || 0}</p>
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
                  <p className="metric-number">${summary.totalSpending?.toLocaleString() || 0}</p>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-icon-wrapper orange">
                  <svg className="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="metric-content">
                  <p className="metric-label">Total Tax</p>
                  <p className="metric-number">${summary.totalTax?.toLocaleString() || 0}</p>
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
                  <p className="metric-number">{summary.uniqueVendors || 0}</p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="summary-card-large">
              <h2 className="section-title">
                <svg className="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Executive Summary
              </h2>
              <div className="summary-text">
                <p>{summary.textSummary || 'Your AI-generated executive summary will appear here. This will include key insights about spending patterns, top vendors, and notable trends across all uploaded financial documents.'}</p>
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
                              backgroundColor: categoryChartData.datasets[0].backgroundColor[idx] 
                            }}
                          ></div>
                          <span className="category-text">{cat.category}</span>
                        </div>
                        <span className="category-value">${cat.amount.toLocaleString()}</span>
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
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="empty-title">No Data Yet</h3>
            <p className="empty-text">Click "Generate AI Summary" to analyze your uploaded documents</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;