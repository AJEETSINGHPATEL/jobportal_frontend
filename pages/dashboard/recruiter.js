import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import Link from 'next/link';
import { FaBriefcase, FaUserFriends, FaEye, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function RecruiterDashboard({ user }) {
  const [metrics, setMetrics] = useState({
    openJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    shortlisted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch jobs posted by this recruiter
      const jobsResponse = await api.request('/jobs/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // For now, we'll simulate the metrics
      const openJobs = jobsResponse.filter(job => job.is_active).length;
      const totalApplications = jobsResponse.reduce((sum, job) => sum + (job.application_count || 0), 0);
      const newApplications = Math.floor(totalApplications * 0.3); // 30% are new
      const shortlisted = Math.floor(totalApplications * 0.2); // 20% are shortlisted
      
      setMetrics({
        openJobs,
        totalApplications,
        newApplications,
        shortlisted
      });
      
      // Show the 5 most recent jobs
      const sortedJobs = [...jobsResponse].sort((a, b) => 
        new Date(b.posted_at) - new Date(a.posted_at)
      );
      setRecentJobs(sortedJobs.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <div className="error-state">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn btn-primary">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Recruiter Dashboard</h1>
        <p>Welcome back, {user?.full_name || 'Recruiter'}</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon bg-blue">
            <FaBriefcase />
          </div>
          <div className="metric-content">
            <h3>{metrics.openJobs}</h3>
            <p>Open Jobs</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-green">
            <FaUserFriends />
          </div>
          <div className="metric-content">
            <h3>{metrics.totalApplications}</h3>
            <p>Total Applications</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-orange">
            <FaClock />
          </div>
          <div className="metric-content">
            <h3>{metrics.newApplications}</h3>
            <p>New Applications</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon bg-purple">
            <FaCheckCircle />
          </div>
          <div className="metric-content">
            <h3>{metrics.shortlisted}</h3>
            <p>Shortlisted</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Jobs</h2>
          <Link href="/post-job" className="btn btn-primary">
            Post New Job
          </Link>
        </div>
        
        {recentJobs.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any jobs yet.</p>
            <Link href="/post-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="jobs-list">
            {recentJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`status-badge ${job.is_active ? 'active' : 'inactive'}`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="job-details">
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Applications:</strong> {job.application_count || 0}</p>
                </div>
                
                <div className="job-actions">
                  <Link href={`/jobs/${job.id}`} className="btn btn-outline">
                    <FaEye /> View
                  </Link>
                  <Link href={`/jobs/${job.id}/edit`} className="btn btn-primary">
                    Edit
                  </Link>
                  <Link href={`/applications?jobId=${job.id}`} className="btn btn-secondary">
                    Applications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-container {
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
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .metric-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .metric-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }
        
        .bg-blue { background: #0070f3; }
        .bg-green { background: #28a745; }
        .bg-orange { background: #fd7e14; }
        .bg-purple { background: #6f42c1; }
        
        .metric-content h3 {
          margin: 0 0 5px 0;
          font-size: 1.8rem;
          color: #333;
        }
        
        .metric-content p {
          margin: 0;
          color: #666;
        }
        
        .section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .section-header h2 {
          margin: 0;
          color: #333;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }
        
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .job-card {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
        }
        
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .job-header h3 {
          margin: 0;
          color: #333;
        }
        
        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .active {
          background: #d4edda;
          color: #155724;
        }
        
        .inactive {
          background: #f8d7da;
          color: #721c24;
        }
        
        .job-details {
          margin-bottom: 20px;
        }
        
        .job-details p {
          margin: 0 0 10px 0;
          color: #666;
        }
        
        .job-actions {
          display: flex;
          gap: 10px;
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
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn:hover {
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
          
          .job-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}