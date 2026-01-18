import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import { FaBriefcase, FaClock, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter } from 'react-icons/fa';

export default function ApplicationsPage({ user }) {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch applications using the API client which handles authentication
      const applicationsData = await api.getApplications();
      setApplications(applicationsData);
    } catch (err) {
      // Handle if error is an object
      let errorMessage = err.message || 'Error loading applications';
      if (typeof errorMessage === 'object') {
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage[0]?.msg || 'Error loading applications';
        } else {
          errorMessage = errorMessage.msg || JSON.stringify(errorMessage);
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (applicationId) => {
    console.log('Attempting to fetch application details for ID:', applicationId);
    
    try {
      const application = await api.getApplicationById(applicationId);
      console.log('Application data received:', application);
      
      // Create a more detailed modal or popup instead of alert
      const applicationDetails = `Application Details:\n\n` +
        `Job Title: ${application.job_title || 'N/A'}\n` +
        `Company: ${application.company || 'N/A'}\n` +
        `Status: ${getStatusText(application.status)}\n` +
        `Applied Date: ${application.applied_date ? new Date(application.applied_date).toLocaleDateString() : 
                     application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}\n` +
        `Cover Letter: ${application.cover_letter ? application.cover_letter.substring(0, 150) + '...' : 'N/A'}`;
      
      alert(applicationDetails);
    } catch (err) {
      console.error('Error fetching application details:', err);
      console.error('Error status:', err.status);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Error loading application details';
      if (err.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.status === 404) {
        errorMessage = 'Application not found.';
      } else if (err.status === 400) {
        errorMessage = 'Invalid application ID format.';
      } else {
        // Handle if error is an object
        if (typeof err.message === 'object') {
          if (Array.isArray(err.message)) {
            errorMessage = err.message[0]?.msg || 'Error loading application details';
          } else {
            errorMessage = err.message.msg || JSON.stringify(err.message);
          }
        } else {
          errorMessage += ': ' + err.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <FaClock className="status-icon applied" />;
      case 'reviewed':
        return <FaClock className="status-icon reviewed" />;
      case 'interview':
        return <FaClock className="status-icon interview" />;
      case 'offered':
        return <FaCheckCircle className="status-icon offered" />;
      case 'accepted':
        return <FaCheckCircle className="status-icon accepted" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return <FaClock className="status-icon default" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'reviewed':
        return 'Under Review';
      case 'interview':
        return 'Interview Scheduled';
      case 'offered':
        return 'Offered';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'applied':
        return 'status-applied';
      case 'reviewed':
        return 'status-reviewed';
      case 'interview':
        return 'status-interview';
      case 'offered':
        return 'status-offered';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!user) {
    return (
      <div className="applications-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="applications-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">
        <div className="error-container">
          <h2>Error Loading Applications</h2>
          <p>{typeof error === 'object' ? JSON.stringify(error) : error}</p>
          <button onClick={fetchApplications} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <h1>Applications</h1>
        <p>Manage job applications</p>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search applications by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-options">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Applications</option>
            <option value="applied">Applied</option>
            <option value="reviewed">Under Review</option>
            <option value="interview">Interview</option>
            <option value="offered">Offered</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Stats */}
      <div className="applications-stats">
        <div className="stat-card">
          <div className="stat-value">{applications.length}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{applications.filter(a => a.status === 'interview').length}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{applications.filter(a => a.status === 'accepted').length}</div>
          <div className="stat-label">Offers Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{applications.filter(a => a.status === 'rejected').length}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="applications-list">
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <div className="empty-icon">
              <FaBriefcase />
            </div>
            <h3>No Applications Found</h3>
            <p>
              {filter !== 'all' 
                ? `You don't have any applications with status "${getStatusText(filter)}"`
                : searchTerm 
                  ? `No applications match your search for "${searchTerm}"`
                  : "No applications found"}
            </p>
          </div>
        ) : (
          filteredApplications.map(application => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <div className="job-info">
                  <h3>{application.job_title || `Job ${application.job_id}`}</h3>
                  <div className="company-info">
                    <span className="company-name">{application.company || 'Company'}</span>
                    <span className="job-location">Status: {application.status}</span>
                  </div>
                </div>
                
                <div className="application-status">
                  <span className={`status-badge ${getStatusClass(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {getStatusText(application.status)}
                  </span>
                </div>
              </div>
              
              <div className="application-details">
                <div className="detail-item">
                  <span className="detail-label">Applied On:</span>
                  <span className="detail-value">
                    {application.applied_date ? new Date(application.applied_date).toLocaleDateString() : 
                     application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {application.cover_letter && (
                  <div className="detail-item">
                    <span className="detail-label">Cover Letter:</span>
                    <div className="detail-value cover-letter-preview">
                      {application.cover_letter.substring(0, 100)}...
                    </div>
                  </div>
                )}
              </div>
              
              <div className="application-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => handleViewDetails(application.id)}
                >
                  View Details
                </button>
                <button className="btn btn-primary">Update Status</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};