import React, { useState, useEffect } from 'react';

function App() {
  const [influencers, setInfluencers] = useState(() => {
    const savedInfluencers = localStorage.getItem('influencers');
    return savedInfluencers ? JSON.parse(savedInfluencers) : [];
  });
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [username, setUsername] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [viewsMedian, setViewsMedian] = useState('');
  const [viewsNow, setViewsNow] = useState('');
  const [videoLinks, setVideoLinks] = useState(['', '', '', '']);
  const [postedOnDates, setPostedOnDates] = useState(['', '', '', '']);
  const [status, setStatus] = useState('Posted');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load influencers from localStorage on initial render
  useEffect(() => {
    const storedInfluencers = localStorage.getItem('influencers');
    if (storedInfluencers) {
      setInfluencers(JSON.parse(storedInfluencers));
    }
  }, []);

  // Update localStorage whenever influencers state changes
  useEffect(() => {
    localStorage.setItem('influencers', JSON.stringify(influencers));
    applyFilter();
  }, [influencers]);

  // Load filter status from localStorage
  useEffect(() => {
    const savedFilterStatus = localStorage.getItem('filterStatus');
    if (savedFilterStatus) {
      setFilterStatus(savedFilterStatus);
    }
  }, []);

  // Save filter status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('filterStatus', filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    applyFilter();
  }, [influencers, filterStatus]);

  const handleVideoLinkChange = (index, value) => {
    const newVideoLinks = [...videoLinks];
    newVideoLinks[index] = value;
    setVideoLinks(newVideoLinks);
  };

  const handlePostedOnChange = (index, value) => {
    const newPostedOnDates = [...postedOnDates];
    newPostedOnDates[index] = value;
    setPostedOnDates(newPostedOnDates);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !profileLink || !viewsMedian) {
      alert('Please fill in all required fields: Username, Profile Link, and Views Median.');
      return;
    }

    const newInfluencer = {
      id: Date.now(),
      username,
      profileLink,
      platform,
      viewsMedian: Number(viewsMedian),
      totalViews: Number(viewsMedian) * 5,
      viewsNow: Number(viewsNow) || 0,
      videoLinks,
      postedOnDates,
      status,
    };
    setInfluencers([...influencers, newInfluencer]);
    // Reset form fields
    setUsername('');
    setProfileLink('');
    setPlatform('Instagram');
    setViewsMedian('');
    setViewsNow('');
    setVideoLinks(['', '', '', '']);
    setPostedOnDates(['', '', '', '']);
    setStatus('Posted');
  };

  const applyFilter = () => {
    if (filterStatus === 'All') {
      setFilteredInfluencers([...influencers]);
    } else {
      const filtered = influencers.filter(
        (influencer) => influencer.status === filterStatus
      );
      setFilteredInfluencers(filtered);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };
  
  const markAsPaid = (id) => {
    setInfluencers(influencers.map(inf => 
      inf.id === id ? { ...inf, status: 'Paid' } : inf
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Posted':
        return 'status-posted';
      case 'Script Needed':
        return 'status-script-needed';
      case 'Approval Needed':
        return 'status-approval-needed';
      case 'Paid':
        return 'status-paid';
      default:
        return '';
    }
  };

  const totalCampaignViews = filteredInfluencers.reduce(
    (sum, influencer) => sum + influencer.totalViews,
    0
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Influencer Post Tracker</h1>
      </header>
      <main>
        <section className="form-section">
          <h2>Add Influencer Details</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label>Profile Link:</label>
              <input type="url" value={profileLink} onChange={(e) => setProfileLink(e.target.value)} required />
            </div>
            <div>
              <label>Platform:</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label>Views Median:</label>
              <input type="number" value={viewsMedian} onChange={(e) => setViewsMedian(e.target.value)} required />
            </div>
            <div>
              <label>Total Views:</label>
              <input type="text" value={viewsMedian ? Number(viewsMedian) * 5 : ''} readOnly disabled />
            </div>
            <div>
              <label>Views Now:</label>
              <input type="number" value={viewsNow} onChange={(e) => setViewsNow(e.target.value)} />
            </div>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="video-entry">
                <label>Video Link #{index + 1}:</label>
                <input
                  type="url"
                  value={videoLinks[index]}
                  onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                />
                <label style={{marginLeft: '10px'}}>Posted On #{index + 1}:</label>
                <input
                  type="date"
                  value={postedOnDates[index]}
                  onChange={(e) => handlePostedOnChange(index, e.target.value)}
                />
              </div>
            ))}
            <div>
              <label>Status:</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Posted">Posted</option>
                <option value="Script Needed">Script Needed</option>
                <option value="Approval Needed">Approval Needed</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <button type="submit">Add Influencer</button>
          </form>
        </section>

        <section className="table-section">
          <h2>Influencer List</h2>
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="Posted">Posted</option>
              <option value="Script Needed">Script Needed</option>
              <option value="Approval Needed">Approval Needed</option>
              <option value="Paid">Paid</option>
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
                      <td><a href={influencer.profileLink} target="_blank" rel="noopener noreferrer">{influencer.profileLink}</a></td>
                      <td>{influencer.platform}</td>
                      <td>{influencer.viewsMedian.toLocaleString()}</td>
                      <td>{influencer.totalViews.toLocaleString()}</td>
                      <td>{influencer.viewsNow.toLocaleString()}</td>
                      <td>
                        {influencer.videoLinks.map((link, index) => (
                          link && <div key={index}><a href={link} target="_blank" rel="noopener noreferrer">Video {index + 1}</a> ({influencer.postedOnDates[index] || 'N/A'})</div>
                        ))}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(influencer.status)}`}>
                          {influencer.status}
                        </span>
                      </td>
                      <td>
                        {influencer.status !== 'Paid' && (
                          <button onClick={() => markAsPaid(influencer.id)}>Mark as Paid</button>
                        )}
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