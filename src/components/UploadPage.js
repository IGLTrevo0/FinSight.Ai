  // src/components/UploadPage.js
  import React, { useState, useRef } from 'react';
  import { useNavigate } from 'react-router-dom';

  function UploadPage() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
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
  if (!files.length) return alert('No files');

  setUploading(true);

  const formData = new FormData();

  files.forEach((file) => {
    formData.append('data', file); // must match n8n Binary Property
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

    setUploadStatus('✅ Success! Analyzing documents with AI...');

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

  } catch (error) {
    console.error('Upload error:', error);
    setUploadStatus('❌ Upload failed. Please try again.');
  } finally {
    setUploading(false);
  }
};

    
    return (
      <div className="upload-page-v2">
        <div className="upload-page-v2">
      {/* ADD THIS: Profile Button in Top Right */}
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

      {/* Your existing upload page content stays exactly the same */}
      <div className="upload-bg-shapes">
        {/* ... rest of your existing code ... */}
      </div>
      {/* ... */}
    </div>
        {/* Animated Background */}
        <div className="upload-bg-shapes">
          <div className="upload-shape upload-shape-1"></div>
          <div className="upload-shape upload-shape-2"></div>
          <div className="upload-shape upload-shape-3"></div>
        </div>

        <div className="upload-grid-pattern"></div>

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
      </div>
    );
  }

  export default UploadPage;