import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import Link from 'next/link';
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaStar, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function AppliedJobs({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.request('/applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApplications(response);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <FaClock />;
      case 'reviewed':
        return <FaClock />;
      case 'interview':
        return <FaClock />;
      case 'offered':
        return <FaCheckCircle />;
      case 'accepted':
        return <FaCheckCircle />;
      case 'rejected':
        return <FaTimesCircle />;
      default:
        return <FaClock />;
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

  if (loading) return (
    <div className="applied-jobs-container">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="applied-jobs-container">
      <div className="error-state">
        <h3>Error Loading Applications</h3>
        <p>{error}</p>
        <button onClick={fetchApplications} className="btn btn-primary">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="applied-jobs-container">
      <div className="header">
        <h1>Applied Jobs</h1>
        <p>{applications.length} applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Applications Yet</h3>
          <p>You haven't applied to any jobs yet.</p>
          <Link href="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-content">
                <div className="job-company-logo">
                  <div className="logo-placeholder">
                    <FaBriefcase />
                  </div>
                </div>
                
                <div className="application-details">
                  <div className="application-header">
                    <h3 className="job-title">{application.job_title}</h3>
                    <span className={`status-badge ${getStatusClass(application.status)}`}>
                      {getStatusIcon(application.status)} {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="company-info">
                    <span className="company-name">{application.company}</span>
                    <span className="company-rating">
                      <FaStar /> 4.2 | 1.2k reviews
                    </span>
                  </div>
                  
                  <div className="job-meta">
                    <span className="job-location">
                      <FaMapMarkerAlt /> {application.location}
                    </span>
                    <span className="application-date">
                      Applied on {new Date(application.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="application-actions">
                <Link href={`/jobs/${application.job_id}`} className="btn btn-outline">
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .applied-jobs-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .header p {
          margin: 0;
          color: #666;
        }
        
        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-state h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .error-state p {
          margin: 0 0 20px 0;
          color: #666;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        
        .empty-state h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .empty-state p {
          margin: 0 0 20px 0;
          color: #666;
        }
        
        .application-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }
        
        .application-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .application-content {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .job-company-logo {
          flex-shrink: 0;
        }
        
        .logo-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #f5f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0070f3;
          font-size: 1.5rem;
        }
        
        .application-details {
          flex: 1;
        }
        
        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .job-title {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          color: #333;
          font-weight: 600;
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-applied, .status-reviewed, .status-interview, .status-default {
          background: #e8f4ff;
          color: #0070f3;
        }
        
        .status-offered, .status-accepted {
          background: #d4edda;
          color: #155724;
        }
        
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }
        
        .company-info {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .company-name {
          font-weight: 500;
          color: #333;
        }
        
        .company-rating {
          color: #666;
          font-size: 0.9rem;
        }
        
        .job-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        
        .job-location, .application-date {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          color: #666;
        }
        
        .application-actions {
          display: flex;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #eee;
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
          font-size: 0.9rem;
        }
        
        .btn-primary {
          background: #0070f3;
          color: white;
        }
        
        .btn-outline {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }
        
        .btn:hover {
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .application-content {
            flex-direction: column;
          }
          
          .application-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .application-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}