import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { FaSearch, FaUser, FaBriefcase, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaClock, FaEdit } from 'react-icons/fa';

export default function ApplicationsManagement() {
  const router = useRouter();
  const { jobId, status } = router.query;
  const { user: authUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(status || 'all');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (authUser) {
      if (authUser.role === 'employer') {
        fetchEmployerData();
      } else if (authUser.role === 'job_seeker') {
        fetchJobSeekerData();
      } else {
        setError('Access denied: Insufficient permissions');
        setLoading(false);
      }
    } else {
      setError('Access denied: Please log in');
      setLoading(false);
    }
  }, [authUser, jobId, status]);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter]);

  const fetchEmployerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get employer's jobs
      let employerJobs;
      try {
        employerJobs = await api.getEmployerJobs();
      } catch {
        // Fallback to admin jobs
        const allJobs = await api.getAdminJobs();
        employerJobs = allJobs.filter(job => job.employer_id === authUser.id || job.created_by === authUser.id);
      }
      setJobs(employerJobs);

      // Get applications for employer's jobs
      let employerApplications;
      try {
        employerApplications = await api.getEmployerApplications();
      } catch {
        // Fallback: get all applications and filter by employer's jobs
        const allApplications = await api.getApplications({});
        employerApplications = allApplications.filter(app => {
          return employerJobs.some(job => job.id === app.job_id || job._id === app.job_id);
        });
      }

      setApplications(employerApplications);
      setFilteredApplications(employerApplications);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSeekerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get job seeker's applications
      const userApplications = await api.getApplications({});
      setApplications(userApplications);
      setFilteredApplications(userApplications);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (statusFilter === 'all') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app => app.status === statusFilter);
      setFilteredApplications(filtered);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await api.request(`/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      // Also update filtered applications
      setFilteredApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      alert('Error updating application status: ' + err.message);
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
      case 'shortlisted':
        return <FaCheckCircle />;
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
      case 'shortlisted':
        return 'status-shortlisted';
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
    <div className="applications-container">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="applications-container">
      <div className="error-state">
        <h3>Error Loading Applications</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Refresh Page</button>
      </div>
    </div>
  );

  return (
    <div className="applications-container">
      <div className="header">
        <h1>{authUser?.role === 'employer' ? 'Applications Management' : 'My Applications'}</h1>
        <p>Manage {authUser?.role === 'employer' ? 'job applications from candidates' : 'your job applications'}</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Applications</option>
            <option value="applied">Applied</option>
            <option value="reviewed">Reviewed</option>
            <option value="interview">Interview</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="offered">Offered</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {jobId && (
          <div className="filter-info">
            Showing applications for specific job
          </div>
        )}
      </div>

      <div className="results-header">
        <h2>Applications ({filteredApplications.length})</h2>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Applications Found</h3>
          <p>
            {statusFilter === 'all' 
              ? authUser?.role === 'employer' 
                ? 'No applications received yet' 
                : 'You have not applied to any jobs yet'
              : `No applications with status "${statusFilter}"`}
          </p>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((application) => {
            // Find the job associated with this application
            const job = jobs.find(j => j.id === application.job_id || j._id === application.job_id);
            return (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <h3>{authUser?.role === 'employer' ? application.applicant_name || 'Candidate Name' : job?.title || 'Job Title'}</h3>
                      <p>{authUser?.role === 'employer' ? application.applicant_email || 'candidate@email.com' : job?.company || 'Company Name'}</p>
                    </div>
                  </div>
                  
                  <div className="application-status">
                    <span className={`status-badge ${getStatusClass(application.status)}`}>
                      {getStatusIcon(application.status)} {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="application-details">
                  <div className="detail-item">
                    <FaBriefcase className="detail-icon" />
                    <div>
                      <h4>Position</h4>
                      <p>{authUser?.role === 'employer' ? job?.title || application.job_title || 'Software Engineer' : application.job_title || 'Software Engineer'}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div>
                      <h4>Location</h4>
                      <p>{job?.location || 'Bangalore, India'}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div>
                      <h4>Applied On</h4>
                      <p>{new Date(application.applied_date || application.timestamp || application.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="application-actions">
                  {application.resume_url && (
                    <a 
                      href={application.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      View Resume
                    </a>
                  )}
                  <button className="btn btn-outline">
                    View Profile
                  </button>
                  {authUser?.role === 'employer' && (
                    <div className="status-actions">
                      <select 
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="interview">Interview</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="offered">Offered</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .applications-container {
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
        
        .filters {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .filter-group label {
          font-weight: 500;
          color: #333;
        }
        
        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
        }
        
        .filter-info {
          color: #666;
          font-size: 0.9rem;
        }
        
        .results-header {
          background: white;
          border-radius: 8px;
          padding: 15px 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .results-header h2 {
          margin: 0;
          color: #333;
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
          margin: 0;
          color: #666;
        }
        
        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .application-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .candidate-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .candidate-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f5f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0070f3;
          font-size: 1.2rem;
        }
        
        .candidate-info h3 {
          margin: 0 0 5px 0;
          color: #333;
        }
        
        .candidate-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
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
        
        .status-shortlisted, .status-offered, .status-accepted {
          background: #d4edda;
          color: #155724;
        }
        
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }
        
        .application-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          display: flex;
          gap: 15px;
        }
        
        .detail-icon {
          color: #0070f3;
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 3px;
        }
        
        .detail-item h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 0.9rem;
        }
        
        .detail-item p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .application-actions {
          display: flex;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .status-actions {
          margin-left: auto;
        }
        
        .status-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
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
          .application-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .application-details {
            grid-template-columns: 1fr;
          }
          
          .application-actions {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .status-actions {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}