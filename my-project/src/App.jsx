import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Constants
const PLATFORMS = ['Instagram', 'TikTok', 'Both'];
const STATUSES = ['Posted', 'Script Needed', 'Approval Needed', 'Paid'];
const LOCAL_STORAGE_KEYS = {
  INFLUENCERS: 'influencers',
  FILTER_STATUS: 'filterStatus'
};

// Utility functions for local storage
const localStorageUtils = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }
};

// Form validation
const validateInfluencer = (influencer) => {
  const errors = {};
  
  if (!influencer.username.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!influencer.profileLink.trim()) {
    errors.profileLink = 'Profile link is required';
  } else if (!isValidUrl(influencer.profileLink)) {
    errors.profileLink = 'Please enter a valid URL';
  }
  
  if (!influencer.viewsMedian || influencer.viewsMedian <= 0) {
    errors.viewsMedian = 'Views median must be a positive number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

function App() {
  // State management
  const [influencers, setInfluencers] = useState(() => 
    localStorageUtils.get(LOCAL_STORAGE_KEYS.INFLUENCERS, [])
  );
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [filterStatus, setFilterStatus] = useState(() => 
    localStorageUtils.get(LOCAL_STORAGE_KEYS.FILTER_STATUS, 'All')
  );
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    profileLink: '',
    platform: 'Instagram',
    viewsMedian: '',
    viewsNow: '',
    videoLinks: ['', '', '', ''],
    postedOnDates: ['', '', '', ''],
    status: 'Posted'
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Memoized calculations
  const totalCampaignViews = useMemo(() => 
    filteredInfluencers.reduce((sum, influencer) => sum + influencer.totalViews, 0),
    [filteredInfluencers]
  );

  // Local storage effects
  useEffect(() => {
    const success = localStorageUtils.set(LOCAL_STORAGE_KEYS.INFLUENCERS, influencers);
    if (!success) {
      showNotification('Failed to save data to local storage', 'error');
    }
  }, [influencers]);

  useEffect(() => {
    localStorageUtils.set(LOCAL_STORAGE_KEYS.FILTER_STATUS, filterStatus);
  }, [filterStatus]);

  // Filter effect
  useEffect(() => {
    applyFilter();
  }, [influencers, filterStatus]);

  // Utility functions
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      username: '',
      profileLink: '',
      platform: 'Instagram',
      viewsMedian: '',
      viewsNow: '',
      videoLinks: ['', '', '', ''],
      postedOnDates: ['', '', '', ''],
      status: 'Posted'
    });
    setErrors({});
    setEditingId(null);
  }, []);

  const applyFilter = useCallback(() => {
    if (filterStatus === 'All') {
      setFilteredInfluencers([...influencers]);
    } else {
      const filtered = influencers.filter(
        (influencer) => influencer.status === filterStatus
      );
      setFilteredInfluencers(filtered);
    }
  }, [influencers, filterStatus]);

  // Form handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const handleVideoLinkChange = useCallback((index, value) => {
    setFormData(prev => ({
      ...prev,
      videoLinks: prev.videoLinks.map((link, i) => i === index ? value : link)
    }));
  }, []);

  const handlePostedOnChange = useCallback((index, value) => {
    setFormData(prev => ({
      ...prev,
      postedOnDates: prev.postedOnDates.map((date, i) => i === index ? value : date)
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateInfluencer(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const influencerData = {
        id: editingId || Date.now(),
        username: formData.username.trim(),
        profileLink: formData.profileLink.trim(),
        platform: formData.platform,
        viewsMedian: Number(formData.viewsMedian),
        totalViews: Number(formData.viewsMedian) * 5,
        viewsNow: Number(formData.viewsNow) || 0,
        videoLinks: formData.videoLinks,
        postedOnDates: formData.postedOnDates,
        status: formData.status,
        createdAt: editingId ? influencers.find(inf => inf.id === editingId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        setInfluencers(prev => 
          prev.map(inf => inf.id === editingId ? influencerData : inf)
        );
        showNotification('Influencer updated successfully');
      } else {
        setInfluencers(prev => [...prev, influencerData]);
        showNotification('Influencer added successfully');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving influencer:', error);
      showNotification('Failed to save influencer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action handlers
  const markAsPaid = useCallback((id) => {
    setInfluencers(prev => 
      prev.map(inf => 
        inf.id === id ? { ...inf, status: 'Paid', updatedAt: new Date().toISOString() } : inf
      )
    );
    showNotification('Influencer marked as paid');
  }, [showNotification]);

  const editInfluencer = useCallback((influencer) => {
    setFormData({
      username: influencer.username,
      profileLink: influencer.profileLink,
      platform: influencer.platform,
      viewsMedian: influencer.viewsMedian.toString(),
      viewsNow: influencer.viewsNow.toString(),
      videoLinks: [...influencer.videoLinks],
      postedOnDates: [...influencer.postedOnDates],
      status: influencer.status
    });
    setEditingId(influencer.id);
    setErrors({});
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  }, []);

  const deleteInfluencer = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this influencer?')) {
      setInfluencers(prev => prev.filter(inf => inf.id !== id));
      showNotification('Influencer deleted successfully');
      
      // If editing this influencer, reset form
      if (editingId === id) {
        resetForm();
      }
    }
  }, [editingId, resetForm, showNotification]);

  const duplicateInfluencer = useCallback((influencer) => {
    const duplicatedInfluencer = {
      ...influencer,
      id: Date.now(),
      username: `${influencer.username} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setInfluencers(prev => [...prev, duplicatedInfluencer]);
    showNotification('Influencer duplicated successfully');
  }, [showNotification]);

  const getStatusBadgeClass = useCallback((status) => {
    const statusMap = {
      'Posted': 'status-posted',
      'Script Needed': 'status-script-needed',
      'Approval Needed': 'status-approval-needed',
      'Paid': 'status-paid'
    };
    return statusMap[status] || '';
  }, []);

  // Export/Import functionality
  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify(influencers, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `influencers-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showNotification('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export data', 'error');
    }
  }, [influencers, showNotification]);

  const importData = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setInfluencers(importedData);
          showNotification('Data imported successfully');
        } else {
          showNotification('Invalid file format', 'error');
        }
      } catch (error) {
        console.error('Import error:', error);
        showNotification('Failed to import data', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }, [showNotification]);

  return (
    <div className="App">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="App-header">
        <h1>Influencer Post Tracker</h1>
      </header>

      <main>
        <section className="form-section">
          <h2>{editingId ? 'Edit Influencer Details' : 'Add Influencer Details'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input 
                type="text" 
                value={formData.username} 
                onChange={(e) => handleInputChange('username', e.target.value)} 
                className={errors.username ? 'error' : ''}
                required 
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div>
              <label>Profile Link:</label>
              <input 
                type="url" 
                value={formData.profileLink} 
                onChange={(e) => handleInputChange('profileLink', e.target.value)} 
                className={errors.profileLink ? 'error' : ''}
                required 
              />
              {errors.profileLink && <span className="error-message">{errors.profileLink}</span>}
            </div>

            <div>
              <label>Platform:</label>
              <select 
                value={formData.platform} 
                onChange={(e) => handleInputChange('platform', e.target.value)}
              >
                {PLATFORMS.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Views Median:</label>
              <input 
                type="number" 
                value={formData.viewsMedian} 
                onChange={(e) => handleInputChange('viewsMedian', e.target.value)} 
                className={errors.viewsMedian ? 'error' : ''}
                required 
                min="1"
              />
              {errors.viewsMedian && <span className="error-message">{errors.viewsMedian}</span>}
            </div>

            <div>
              <label>Total Views:</label>
              <input 
                type="text" 
                value={formData.viewsMedian ? (Number(formData.viewsMedian) * 5).toLocaleString() : ''} 
                readOnly 
                disabled 
              />
            </div>

            <div>
              <label>Views Now:</label>
              <input 
                type="number" 
                value={formData.viewsNow} 
                onChange={(e) => handleInputChange('viewsNow', e.target.value)} 
                min="0"
              />
            </div>

            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="video-entry">
                <label>Video Link #{index + 1}:</label>
                <input
                  type="url"
                  value={formData.videoLinks[index]}
                  onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                />
                <label style={{marginLeft: '10px'}}>Posted On #{index + 1}:</label>
                <input
                  type="date"
                  value={formData.postedOnDates[index]}
                  onChange={(e) => handlePostedOnChange(index, e.target.value)}
                />
              </div>
            ))}

            <div>
              <label>Status:</label>
              <select 
                value={formData.status} 
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Influencer' : 'Add Influencer'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="table-section">
          <div className="section-header">
            <h2>Influencer List ({filteredInfluencers.length})</h2>
            <div className="data-actions">
              <button onClick={exportData} className="export-btn">Export Data</button>
              <label className="import-btn">
                Import Data
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={importData} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
          </div>

          <div className="filter-section">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="total-campaign-views">
            <h3>Total Views for Campaign: {totalCampaignViews.toLocaleString()}</h3>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Profile Link</th>
                  <th>Platform</th>
                  <th>Views Median</th>
                  <th>Total Views</th>
                  <th>Views Now</th>
                  <th>Video Links & Posted On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInfluencers.length > 0 ? (
                  filteredInfluencers.map((influencer) => (
                    <tr key={influencer.id}>
                      <td>{influencer.username}</td>
                      <td>
                        <a href={influencer.profileLink} target="_blank" rel="noopener noreferrer">
                          {influencer.profileLink.length > 30 
                            ? `${influencer.profileLink.substring(0, 30)}...` 
                            : influencer.profileLink}
                        </a>
                      </td>
                      <td>{influencer.platform}</td>
                      <td>{influencer.viewsMedian.toLocaleString()}</td>
                      <td>{influencer.totalViews.toLocaleString()}</td>
                      <td>{influencer.viewsNow.toLocaleString()}</td>
                      <td>
                        {influencer.videoLinks.map((link, index) => (
                          link && (
                            <div key={index}>
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                Video {index + 1}
                              </a> ({influencer.postedOnDates[index] || 'N/A'})
                            </div>
                          )
                        ))}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(influencer.status)}`}>
                          {influencer.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => editInfluencer(influencer)}
                            className="edit-btn"
                            title="Edit influencer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => duplicateInfluencer(influencer)}
                            className="duplicate-btn"
                            title="Duplicate influencer"
                          >
                            Duplicate
                          </button>
                          {influencer.status !== 'Paid' && (
                            <button 
                              onClick={() => markAsPaid(influencer.id)}
                              className="paid-btn"
                              title="Mark as paid"
                            >
                              Mark as Paid
                            </button>
                          )}
                          <button 
                            onClick={() => deleteInfluencer(influencer.id)}
                            className="delete-btn"
                            title="Delete influencer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No influencers found matching the filter or no influencers added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 