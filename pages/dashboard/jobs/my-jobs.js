import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import { FaTrash, FaEdit, FaEye, FaUsers, FaChartBar, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

export default function MyJobs({ user }) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authUser && authUser.role === 'employer') {
      fetchEmployerJobs();
    } else if (!authUser) {
      setError('Access denied: Please log in');
      setLoading(false);
    } else {
      setError('Access denied: Only employers can view their jobs');
      setLoading(false);
    }
  }, [authUser]);

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get employer's jobs
      let employerJobs;
      try {
        employerJobs = await api.getEmployerJobs();
      } catch {
        // Fallback to admin jobs and filter by employer
        const allJobs = await api.getAdminJobs();
        employerJobs = allJobs.filter(job => job.employer_id === authUser.id || job.created_by === authUser.id);
      }

      setJobs(employerJobs);
    } catch (err) {
      setError('Failed to load jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await api.request(`/jobs/${jobId}`, {
          method: 'DELETE',
        });
        // Remove from local state
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } catch (err) {
        alert('Error deleting job: ' + err.message);
      }
    }
  };

  const updateJobStatus = async (jobId, isActive) => {
    try {
      await api.request(`/admin/jobs/${jobId}/status?is_active=${isActive}`, {
        method: 'PUT',
      });
      
      // Update local state
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_active: isActive } : job
      ));
    } catch (err) {
      alert('Error updating job status: ' + err.message);
    }
  };

  if (loading) return (
    <div className="my-jobs-container">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="my-jobs-container">
      <div className="error-state">
        <h3>Error Loading Jobs</h3>
        <p>{error}</p>
        {error.includes('log in') ? (
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
        ) : (
          <button onClick={fetchEmployerJobs} className="btn btn-primary">Retry</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="my-jobs-container">
      <div className="header">
        <h1>My Job Postings</h1>
        <p>{jobs.length} jobs posted</p>
      </div>

      <div className="actions-bar">
        <Link href="/post-job" className="btn btn-primary">
          <FaEdit /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No Jobs Posted</h3>
          <p>You haven't posted any jobs yet.</p>
          <Link href="/post-job" className="btn btn-primary">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-content">
                <div className="job-details">
                  <div className="job-header-info">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-status">
                      <span className={`status-badge ${job.is_active ? 'status-active' : 'status-inactive'}`}>
                        {job.is_active ? <><FaCheck /> Active</> : <><FaTimes /> Inactive</>}
                      </span>
                    </div>
                  </div>
                  
                  <div className="company-info">
                    <span className="company-name">{job.company}</span>
                  </div>
                  
                  <div className="job-meta">
                    <span className="job-location">
                      <FaEye /> {job.view_count || 0} views
                    </span>
                    <span className="job-applicants">
                      <FaUsers /> {job.application_count || 0} applicants
                    </span>
                    <span className="job-posted">
                      <FaClock /> {new Date(job.posted_date || job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="job-skills">
                    {job.skills && job.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="job-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <FaEye /> View
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => router.push(`/dashboard/jobs/edit/${job.id}`)}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className={`btn ${job.is_active ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => updateJobStatus(job.id, !job.is_active)}
                >
                  {job.is_active ? <><FaTimes /> Deactivate</> : <><FaCheck /> Activate</>}
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => deleteJob(job.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .my-jobs-container {
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
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .header p {
          margin: 0;
          color: #666;
        }
        
        .actions-bar {
          margin-bottom: 20px;
          text-align: right;
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
        
        .job-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }
        
        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .job-content {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .job-details {
          flex: 1;
        }
        
        .job-header-info {
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
        
        .company-info {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .company-name {
          font-weight: 500;
          color: #333;
        }
        
        .job-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        
        .job-location, .job-applicants, .job-posted {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          color: #666;
        }
        
        .job-skills {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        
        .skill-tag {
          background: #f0f0f0;
          color: #666;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .job-actions {
          display: flex;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 8px 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }
        
        .btn-primary {
          background: #0070f3;
          color: white;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-outline {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }
        
        .btn-success {
          background: #28a745;
          color: white;
        }
        
        .btn-danger {
          background: #dc3545;
          color: white;
        }
        
        .btn:hover {
          opacity: 0.9;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-active {
          background: #d4edda;
          color: #155724;
        }
        
        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }
        
        @media (max-width: 768px) {
          .job-content {
            flex-direction: column;
          }
          
          .job-header-info {
            flex-direction: column;
            gap: 10px;
          }
          
          .job-actions {
            flex-direction: column;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}