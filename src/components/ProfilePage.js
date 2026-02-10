// src/components/ProfilePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Your existing Supabase client
import '../styles.css';


function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  
  // Profile data
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Email change
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Messages
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch user data on mount
  const fetchUserProfile = useCallback(async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);

      // Fetch profile data from your profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone_number')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      setProfile({
        firstName: profileData?.first_name || '',
        lastName: profileData?.last_name || '',
        phoneNumber: profileData?.phone_number || '',
        email: user.email || ''
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone_number: profile.phoneNumber,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordChange(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  // Handle email change
  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
      setNewEmail('');
      setShowEmailChange(false);
    } catch (error) {
      console.error('Error changing email:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change email' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loader">
          <div className="loader-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Animated Background */}
      <div className="profile-bg-shapes">
        <div className="profile-shape profile-shape-1"></div>
        <div className="profile-shape profile-shape-2"></div>
        <div className="profile-shape profile-shape-3"></div>
        <div className="profile-shape profile-shape-4"></div>
      </div>
      
      <div className="profile-grid-pattern"></div>

      <div className="profile-container">
        {/* Header with Back Button */}
        <div className="profile-header">
          <button onClick={() => navigate('/upload')} className="btn-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Upload
          </button>
          
          <h1 className="profile-title">My Profile</h1>
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {message.type === 'success' ? (
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              ) : (
                <circle cx="12" cy="12" r="10" />
              )}
            </svg>
            {message.text}
          </div>
        )}

        {/* Personal Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h2>Personal Information</h2>
            </div>
            
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={() => setIsEditing(false)} className="btn-cancel">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label>First Name</label>
              <div className="input-box">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter first name"
                />
              </div>
            </div>

            <div className="info-field">
              <label>Last Name</label>
              <div className="input-box">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="info-field">
              <label>Phone Number</label>
              <div className="input-box">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="info-field">
              <label>Email Address</label>
              <div className="input-box disabled">
                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
                <span className="verified-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="profile-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h2>Account Security</h2>
            </div>
          </div>

          <div className="security-options">
            {/* Change Password */}
            <div className="security-item">
              <div className="security-info">
                <div className="security-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2 2l-4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m-2-2l-4.2-4.2" />
                  </svg>
                </div>
                <div>
                  <h3>Change Password</h3>
                  <p>Update your password regularly for security</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordChange(!showPasswordChange)} 
                className="btn-security"
              >
                {showPasswordChange ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showPasswordChange && (
              <div className="security-form">
                <div className="security-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="security-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
                <button 
                  onClick={handleChangePassword} 
                  className="btn-apply"
                  disabled={saving}
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}

            {/* Change Email */}
            <div className="security-item">
              <div className="security-info">
                <div className="security-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h3>Change Email</h3>
                  <p>Update your email address</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmailChange(!showEmailChange)} 
                className="btn-security"
              >
                {showEmailChange ? 'Cancel' : 'Change'}
              </button>
            </div>

            {showEmailChange && (
              <div className="security-form">
                <div className="security-field">
                  <label>New Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                  />
                </div>
                <button 
                  onClick={handleChangeEmail} 
                  className="btn-apply"
                  disabled={saving}
                >
                  {saving ? 'Sending...' : 'Send Verification'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section (Extra Visual Elements) */}
        <div className="profile-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2>Account Activity</h2>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-info">
                <p className="stat-label">Documents Uploaded</p>
                <p className="stat-value">0</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <p className="stat-label">Last Login</p>
                <p className="stat-value">Today</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <p className="stat-label">Account Status</p>
                <p className="stat-value">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default ProfilePage;