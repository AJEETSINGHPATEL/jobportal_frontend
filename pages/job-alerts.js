import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { FaBell, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEnvelope, FaMobileAlt } from 'react-icons/fa';

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    search_params: {
      search: '',
      location: '',
      experience_min: '',
      salary_min: '',
      job_type: '',
      work_mode: '',
      skills: []
    },
    frequency: 'daily',
    email_notifications: true,
    push_notifications: true
  });
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchJobAlerts();
    fetchRecentJobsForAlerts();
  }, []);

  const fetchJobAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we would get the user ID from authentication
      // For now, we'll use a mock user ID
      const userId = 'mock_user_id';
      const alertsData = await api.getUserJobAlerts(userId);
      setAlerts(alertsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentJobsForAlerts = async () => {
    try {
      // In a real app, we would get the user ID from authentication
      const userId = 'mock_user_id';
      const jobsData = await api.getRecentJobsForAlerts(userId);
      setRecentJobs(jobsData);
    } catch (err) {
      console.error('Error fetching recent jobs for alerts:', err);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, we would get the user ID from authentication
      const alertData = {
        ...newAlert,
        user_id: 'mock_user_id'
      };
      
      const createdAlert = await api.createJobAlert(alertData);
      setAlerts([...alerts, createdAlert]);
      setNewAlert({
        title: '',
        search_params: {
          search: '',
          location: '',
          experience_min: '',
          salary_min: '',
          job_type: '',
          work_mode: '',
          skills: []
        },
        frequency: 'daily',
        email_notifications: true,
        push_notifications: true
      });
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this job alert?')) {
      try {
        await api.deleteJobAlert(alertId);
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleAlertStatus = async (alertId, currentStatus) => {
    try {
      const updatedAlert = await api.updateJobAlert(alertId, {
        is_active: !currentStatus
      });
      
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? updatedAlert : alert
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatSearchParams = (params) => {
    const parts = [];
    if (params.search) parts.push(params.search);
    if (params.location) parts.push(params.location);
    if (params.experience_min) parts.push(`${params.experience_min}+ years`);
    if (params.salary_min) parts.push(`₹${params.salary_min}+`);
    if (params.job_type) parts.push(params.job_type);
    if (params.work_mode) parts.push(params.work_mode);
    if (params.skills && params.skills.length > 0) parts.push(params.skills.join(', '));
    
    return parts.length > 0 ? parts.join(' | ') : 'All jobs';
  };

  if (loading) {
    return (
      <div className="job-alerts-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading job alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-alerts-page">
        <div className="error-container">
          <h2>Error Loading Job Alerts</h2>
          <p>{error}</p>
          <button onClick={fetchJobAlerts} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-alerts-page">
      <div className="page-header">
        <h1>
          <FaBell /> Job Alerts
        </h1>
        <p>Get notified about new jobs that match your criteria</p>
      </div>

      {/* Recent Jobs Section */}
      {recentJobs.length > 0 && (
        <div className="recent-jobs-section">
          <h2>New Jobs Matching Your Alerts</h2>
          <div className="recent-jobs-list">
            {recentJobs.slice(0, 5).map((job, index) => (
              <div key={index} className="recent-job-card">
                <h4>{job.title}</h4>
                <div className="job-company">{job.company}</div>
                <div className="job-location">{job.location}</div>
                <div className="job-salary">
                  ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}
                </div>
                <div className="job-meta">
                  {job.experience_required && <span>{job.experience_required} experience</span>}
                  {job.work_mode && <span>{job.work_mode}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Alert Button */}
      <div className="page-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <FaPlus /> {showCreateForm ? 'Cancel' : 'Create Job Alert'}
        </button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className="create-alert-form">
          <h2>Create New Job Alert</h2>
          <form onSubmit={handleCreateAlert}>
            <div className="form-group">
              <label htmlFor="title">Alert Title</label>
              <input
                type="text"
                id="title"
                value={newAlert.title}
                onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                placeholder="e.g., Software Engineer Jobs in Bangalore"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="search">Job Title/Keywords</label>
                <input
                  type="text"
                  id="search"
                  value={newAlert.search_params.search}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    search_params: {...newAlert.search_params, search: e.target.value}
                  })}
                  placeholder="e.g., software engineer, react developer"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={newAlert.search_params.location}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    search_params: {...newAlert.search_params, location: e.target.value}
                  })}
                  placeholder="e.g., Bangalore, Mumbai"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience_min">Minimum Experience (years)</label>
                <input
                  type="number"
                  id="experience_min"
                  value={newAlert.search_params.experience_min}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    search_params: {...newAlert.search_params, experience_min: e.target.value}
                  })}
                  placeholder="e.g., 2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary_min">Minimum Salary (₹)</label>
                <input
                  type="number"
                  id="salary_min"
                  value={newAlert.search_params.salary_min}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    search_params: {...newAlert.search_params, salary_min: e.target.value}
                  })}
                  placeholder="e.g., 500000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="job_type">Job Type</label>
                <select
                  id="job_type"
                  value={newAlert.search_params.job_type}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    search_params: {...newAlert.search_params, job_type: e.target.value}
                  })}
                >
                  <option value="">Any</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="work_mode">Work Mode</label>
                <select
                  id="work_mode"
                  value={newAlert.search_params.work_mode}
                  onChange={(e) => setNewAlert({
                    ...newAlert, 
                    search_params: {...newAlert.search_params, work_mode: e.target.value}
                  })}
                >
                  <option value="">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills (comma separated)</label>
              <input
                type="text"
                id="skills"
                value={newAlert.search_params.skills.join(', ')}
                onChange={(e) => setNewAlert({
                  ...newAlert, 
                  search_params: {...newAlert.search_params, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)}
                })}
                placeholder="e.g., react, javascript, node.js"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="frequency">Alert Frequency</label>
                <select
                  id="frequency"
                  value={newAlert.frequency}
                  onChange={(e) => setNewAlert({...newAlert, frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="instant">Instant</option>
                </select>
              </div>
            </div>

            <div className="notification-options">
              <div className="notification-option">
                <label>
                  <input
                    type="checkbox"
                    checked={newAlert.email_notifications}
                    onChange={(e) => setNewAlert({...newAlert, email_notifications: e.target.checked})}
                  />
                  <FaEnvelope /> Email Notifications
                </label>
              </div>
              <div className="notification-option">
                <label>
                  <input
                    type="checkbox"
                    checked={newAlert.push_notifications}
                    onChange={(e) => setNewAlert({...newAlert, push_notifications: e.target.checked})}
                  />
                  <FaMobileAlt /> Push Notifications
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Job Alert
            </button>
          </form>
        </div>
      )}

      {/* Alerts List */}
      <div className="alerts-list">
        <h2>My Job Alerts ({alerts.length})</h2>
        
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <p>You don't have any job alerts yet.</p>
            <p>Create your first job alert to get notified about relevant opportunities.</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {alerts.map(alert => (
              <div key={alert.id} className="alert-card">
                <div className="alert-header">
                  <h3>{alert.title}</h3>
                  <button 
                    className="toggle-status-btn"
                    onClick={() => toggleAlertStatus(alert.id, alert.is_active)}
                  >
                    {alert.is_active ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="alert-details">
                  <div className="search-params">
                    <strong>Looking for:</strong> {formatSearchParams(alert.search_params)}
                  </div>
                  <div className="alert-meta">
                    <span className={`status-badge ${alert.is_active ? 'active' : 'inactive'}`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span>Frequency: {alert.frequency}</span>
                  </div>
                </div>
                
                <div className="notification-settings">
                  <div className="notification-item">
                    <FaEnvelope className={alert.email_notifications ? 'enabled' : 'disabled'} />
                    Email
                  </div>
                  <div className="notification-item">
                    <FaMobileAlt className={alert.push_notifications ? 'enabled' : 'disabled'} />
                    Push
                  </div>
                </div>
                
                <div className="alert-actions">
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .job-alerts-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .recent-jobs-section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .recent-jobs-section h2 {
          margin-top: 0;
          color: #333;
        }

        .recent-jobs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .recent-job-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 6px;
          padding: 15px;
        }

        .recent-job-card h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .job-company {
          color: #0070f3;
          font-weight: 500;
        }

        .job-location, .job-salary {
          color: #666;
          font-size: 0.9rem;
          margin: 3px 0;
        }

        .job-meta {
          display: flex;
          gap: 10px;
          margin-top: 5px;
          font-size: 0.8rem;
          color: #888;
        }

        .job-meta span {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .page-actions {
          text-align: center;
          margin-bottom: 30px;
        }

        .create-alert-form {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .create-alert-form h2 {
          margin-top: 0;
          color: #333;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .notification-options {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }

        .notification-option {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notification-option input {
          margin: 0;
        }

        .notification-option svg {
          color: #666;
        }

        .alerts-list {
          margin-top: 30px;
        }

        .alerts-list h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .no-alerts {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .alerts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .alert-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .alert-header h3 {
          margin: 0;
          color: #333;
          flex: 1;
        }

        .toggle-status-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #0070f3;
        }

        .alert-details {
          margin-bottom: 15px;
        }

        .search-params {
          margin-bottom: 10px;
          color: #666;
          font-size: 0.95rem;
        }

        .alert-meta {
          display: flex;
          gap: 15px;
          font-size: 0.9rem;
          color: #888;
        }

        .status-badge {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .notification-settings {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          color: #666;
        }

        .notification-item .enabled {
          color: #28a745;
        }

        .notification-item .disabled {
          color: #6c757d;
        }

        .alert-actions {
          display: flex;
          justify-content: flex-end;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 50px 20px;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .notification-options {
            flex-direction: column;
            gap: 10px;
          }
          
          .alert-meta {
            flex-direction: column;
            gap: 5px;
          }
          
          .notification-settings {
            flex-direction: column;
            gap: 5px;
          }
          
          .alerts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}