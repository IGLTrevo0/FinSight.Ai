// src/components/UploadPage.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function UploadPage() {
  const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const navigate = useNavigate();

  const N8N_UPLOAD_WEBHOOK = 'https://n8n.srv1333057.hstgr.cloud/webhook-test/finsight-upload';

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const combined = [...files, ...newFiles];
    
    if (combined.length > 20) {
      alert('Maximum 20 files allowed');
      return;
    }
    
    setFiles(combined);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!files.length) return alert('No files selected');

    setUploading(true);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('data', file);
    });

    formData.append('fileCount', files.length);
    formData.append(
      'userId',
      localStorage.getItem('user') || 'demo-user'
    );

    try {
      const response = await fetch(N8N_UPLOAD_WEBHOOK, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
        
      }
      const data = await response.json();
    console.log("N8N returned:", data);

    localStorage.setItem(
      "finsight_result",
      JSON.stringify(data));
      

      setUploadStatus('✅ Success! Analyzing documents with AI...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 200);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Scroll to About Section
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
class BackgroundAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.createAnimatedOrbs();
    this.createFloatingShapes();
    this.createParticles();
    this.createAnimatedLines();
    this.createPulseRings();
    this.createGlowSpots();
  }

  // Create container helper
  createContainer(className) {
    const container = document.createElement('div');
    container.className = className;
    return container;
  }

  // 1. Animated Gradient Orbs
  createAnimatedOrbs() {
    const bgShapes = document.querySelector('.upload-bg-shapes');
    if (!bgShapes) return;

    const orbsContainer = this.createContainer('animated-orbs');
    
    for (let i = 1; i <= 4; i++) {
      const orb = document.createElement('div');
      orb.className = `orb orb-${i}`;
      orbsContainer.appendChild(orb);
    }

    bgShapes.appendChild(orbsContainer);
  }

  // 2. Floating Geometric Shapes
  createFloatingShapes() {
    const bgShapes = document.querySelector('.upload-bg-shapes');
    if (!bgShapes) return;

    const shapesContainer = this.createContainer('floating-shapes');

    // Create squares
    for (let i = 1; i <= 3; i++) {
      const square = document.createElement('div');
      square.className = `shape-element square square-${i}`;
      shapesContainer.appendChild(square);
    }

    // Create circles
    for (let i = 1; i <= 3; i++) {
      const circle = document.createElement('div');
      circle.className = `shape-element circle circle-${i}`;
      shapesContainer.appendChild(circle);
    }

    // Create triangles
    for (let i = 1; i <= 3; i++) {
      const triangle = document.createElement('div');
      triangle.className = `shape-element triangle triangle-${i}`;
      shapesContainer.appendChild(triangle);
    }

    bgShapes.appendChild(shapesContainer);
  }

  // 3. Particle System
  createParticles() {
    const bgShapes = document.querySelector('.upload-bg-shapes');
    if (!bgShapes) return;

    const particlesContainer = this.createContainer('particles-container');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random horizontal position
      particle.style.left = `${Math.random() * 100}%`;
      
      // Random animation duration (15-30 seconds)
      const duration = 15 + Math.random() * 15;
      particle.style.animationDuration = `${duration}s`;
      
      // Random delay
      particle.style.animationDelay = `${Math.random() * 10}s`;
      
      // Random drift value for horizontal movement
      const drift = (Math.random() - 0.5) * 200;
      particle.style.setProperty('--drift', `${drift}px`);
      
      // Random size variation
      const size = 2 + Math.random() * 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particlesContainer.appendChild(particle);
    }

    bgShapes.appendChild(particlesContainer);
  }

  // 4. Animated Lines
  createAnimatedLines() {
    const bgShapes = document.querySelector('.upload-bg-shapes');
    if (!bgShapes) return;

    const linesContainer = this.createContainer('animated-lines');

    // Horizontal lines
    for (let i = 1; i <= 3; i++) {
      const line = document.createElement('div');
      line.className = `line line-horizontal line-${i}`;
      linesContainer.appendChild(line);
    }

    // Vertical lines
    for (let i = 4; i <= 5; i++) {
      const line = document.createElement('div');
      line.className = `line line-vertical line-${i}`;
      linesContainer.appendChild(line);
    }

    bgShapes.appendChild(linesContainer);
  }

  // 5. Pulse Rings
  createPulseRings() {
    const bgShapes = document.querySelector('.upload-bg-shapes');
    if (!bgShapes) return;

    const ringsContainer = this.createContainer('pulse-rings');

    for (let i = 1; i <= 3; i++) {
      const ring = document.createElement('div');
      ring.className = `pulse-ring ring-${i}`;
      ringsContainer.appendChild(ring);
    }

    bgShapes.appendChild(ringsContainer);
  }

  // 6. Glow Spots
  createGlowSpots() {
    const bgShapes = document.querySelector('.upload-bg-shapes');
    if (!bgShapes) return;

    const glowContainer = this.createContainer('glow-spots');

    for (let i = 1; i <= 4; i++) {
      const spot = document.createElement('div');
      spot.className = `glow-spot spot-${i}`;
      glowContainer.appendChild(spot);
    }

    bgShapes.appendChild(glowContainer);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BackgroundAnimations();
});

// Also initialize if script loads after DOM
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  new BackgroundAnimations();
}

  if (!selectedFile) {
    alert("Please select a file first");
    return;
  }

  try {
    setLoading(true);

    const data = await fetchSummary(selectedFile);

    setResult(data);

    // save for dashboard
    localStorage.setItem("finsight_result", JSON.stringify(data));

  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://n8n.srv1333057.hstgr.cloud/webhook-test/finsight-upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Request failed: " + res.status);
  return await res.json();
}


  return (
 
   
    <div className="upload-page-v2">
      {/* Animated Background */}
       <input
      type="file"
      onChange={(e) => setSelectedFile(e.target.files[0])}
    />
    <button
  className="btn-generate"
  onClick={uploadFiles}
  disabled={uploading}
>
  {uploading ? (
    <>
      <span className="spinner" />
      Analyzing...
    </>
  ) : (
    <>
      <svg className="generate-icon" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      Generate AI Summary
    </>
  )}
</button>

      <div className="upload-bg-shapes">
        <div className="upload-shape upload-shape-1"></div>
        <div className="upload-shape upload-shape-2"></div>
        <div className="upload-shape upload-shape-3"></div>
      </div>

      <div className="upload-grid-pattern"></div>

      {/* TOP TRANSPARENT BAR */}
      <div className="upload-top-bar">
        <div className="upload-top-left">
          <div className="upload-brand">Finsight AI</div>
          <button onClick={scrollToAbout} className="upload-about">
            About Us
          </button>
        </div>
        
        <div className="upload-top-right">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-nav-secondary"
            title="View Dashboard"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => navigate('/profile')} 
            className="btn-profile-nav"
            title="View Profile"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* MAIN UPLOAD CONTAINER */}
      <div className="upload-container-v2">
        {/* Header */}
        <div className="upload-header-v2">
          <h1 className="upload-title-v2">Upload documents</h1>
          <p className="upload-subtitle-v2">Invoices, receipts, bills (max 20 files)</p>
        </div>

        {/* Main Upload Area */}
        <div
          className={`dropzone-v2 ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx,.doc"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          
          <div className="dropzone-icon-v2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          
          <p className="dropzone-main-text">Drag & drop files here</p>
          <p className="dropzone-or-text">or</p>
          
          <button 
            type="button" 
            className="btn-browse-v2"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Browse files
          </button>
        </div>

        {/* File List Preview */}
        {files.length > 0 && (
          <div className="files-preview-v2">
            <div className="files-header-v2">
              <h3>Selected Files ({files.length}/20)</h3>
              <button 
                onClick={() => setFiles([])} 
                className="btn-clear-v2"
                disabled={uploading}
              >
                Clear all
              </button>
            </div>
            
            <div className="files-list-v2">
              {files.map((file, index) => (
                <div key={index} className="file-card-v2">
                  <div className="file-info-v2">
                    <div className="file-icon-v2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                      </svg>
                    </div>
                    <div className="file-text-v2">
                      <p className="file-name-v2">{file.name}</p>
                      <p className="file-size-v2">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)} 
                    className="btn-remove-v2"
                    disabled={uploading}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={uploadFiles}
          disabled={uploading || files.length === 0}
          className="btn-upload-v2"
        >
          {uploading ? (
            <>
              <span className="spinner-v2"></span>
              Processing...
            </>
          ) : (
            `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`
          )}
        </button>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`upload-status-v2 ${uploadStatus.includes('✅') ? 'success' : uploadStatus.includes('❌') ? 'error' : ''}`}>
            {uploadStatus}
          </div>
        )}

        {/* Supported Formats */}
        <p className="supported-formats-v2">
          Supported formats: PDF, JPG, PNG, Excel, Word
        </p>
      </div>

      {/* ========================================
          ABOUT US SECTION
          ======================================== */}
      <div ref={aboutSectionRef} className="about-section">
        <div className="about-container">
          {/* Section Header */}
          <div className="about-header">
            <h2 className="about-main-title">About Finsight AI</h2>
            <p className="about-main-subtitle">Transforming financial document management with AI-powered intelligence</p>
          </div>

          {/* About Cards Grid */}
          <div className="about-cards-grid">
            {/* WHO WE ARE */}
            <div className="about-card">
              <div className="about-card-icon who-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="about-card-title">Who We Are</h3>
              <p className="about-card-text">
                Finsight AI is a cutting-edge platform that leverages artificial intelligence to revolutionize how businesses handle financial documents. We combine advanced OCR technology with intelligent data extraction to transform complex financial paperwork into actionable insights.
              </p>
              <div className="about-card-features">
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>AI-powered document processing</span>
                </div>
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Enterprise-grade security</span>
                </div>
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Cloud-based infrastructure</span>
                </div>
              </div>
            </div>

            {/* WHY US */}
            <div className="about-card">
              <div className="about-card-icon why-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="about-card-title">Why Choose Us</h3>
              <p className="about-card-text">
                We stand out by offering unparalleled accuracy, speed, and insights. Our platform doesn't just digitize your documents—it understands them, providing intelligent categorization, trend analysis, and automated reporting that saves hours of manual work.
              </p>
              <div className="about-card-features">
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>99.9% accuracy rate</span>
                </div>
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>10x faster processing</span>
                </div>
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Real-time analytics</span>
                </div>
              </div>
            </div>

            {/* HOW IT BENEFITS */}
            <div className="about-card">
              <div className="about-card-icon benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="about-card-title">How It Benefits You</h3>
              <p className="about-card-text">
                Save time, reduce errors, and gain valuable insights into your financial operations. From automated expense categorization to predictive spending analysis, Finsight AI empowers you to make data-driven decisions with confidence and clarity.
              </p>
              <div className="about-card-features">
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Save 15+ hours per week</span>
                </div>
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Reduce manual errors by 95%</span>
                </div>
                <div className="feature-item-about">
                  <svg className="check-icon-about" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Instant financial insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Documents Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
