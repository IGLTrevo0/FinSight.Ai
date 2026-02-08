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

  // Handle file selection via input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  // Add files with validation
  const addFiles = (newFiles) => {
    const combined = [...files, ...newFiles];
    
    if (combined.length > 20) {
      alert('Maximum 20 files allowed');
      return;
    }
    
    setFiles(combined);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Remove a file from the list
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Upload files to n8n
  const uploadFiles = async () => {
    if (files.length === 0) {
      alert('Please select files first');
      return;
    }

    setUploading(true);
    setUploadStatus('Uploading and processing files...');

    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      formData.append('fileCount', files.length);
      formData.append('userId', localStorage.getItem('user') || 'demo-user');

      const response = await fetch(N8N_UPLOAD_WEBHOOK, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setUploadStatus('✅ Files processed successfully! Redirecting to dashboard...');
      
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
    <div className="upload-page">
      <div className="upload-content">
        <h1 className="upload-title">Upload documents</h1>
        <p className="upload-subtitle">Invoices, receipts, bills (max 20 files)</p>

        {/* Drag & Drop Zone */}
        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
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
          
          <div className="dropzone-content">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            
            <p className="dropzone-text">
              Drag & drop files here
            </p>
            <p className="dropzone-or">or</p>
            <button 
              type="button" 
              onClick={handleBrowseClick} 
              className="btn-browse"
              disabled={uploading}
            >
              Browse files
            </button>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="files-preview">
            <div className="files-header">
              <h3>Selected Files ({files.length}/20)</h3>
              <button 
                onClick={() => setFiles([])} 
                className="btn-clear"
                disabled={uploading}
              >
                Clear all
              </button>
            </div>
            
            <div className="files-grid">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)} 
                    className="btn-remove"
                    disabled={uploading}
                  >
                    ×
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
          className="btn-upload"
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`
          )}
        </button>

        {/* Status Message */}
        {uploadStatus && (
          <div className={`upload-status ${uploadStatus.includes('✅') ? 'success' : uploadStatus.includes('❌') ? 'error' : ''}`}>
            {uploadStatus}
          </div>
        )}

        {/* Supported Formats */}
        <p className="supported-formats">
          Supported formats: PDF, JPG, PNG, Excel, Word
        </p>
      </div>
    </div>
  );
}

export default UploadPage;