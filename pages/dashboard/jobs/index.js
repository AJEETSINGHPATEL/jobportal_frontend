import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import Link from 'next/link';
import { FaTrash, FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaStar } from 'react-icons/fa';

export default function SavedJobs({ user }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await api.request('/saved-jobs/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSavedJobs(response);
    } catch (err) {
      setError('Failed to load saved jobs');
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (savedJobId) => {
    if (confirm('Are you sure you want to remove this job from your saved jobs?')) {
      try {
        await api.request(`/saved-jobs/${savedJobId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Remove from local state
        setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
      } catch (err) {
        alert('Error removing saved job: ' + err.message);
      }
    }
  };

  if (loading) return (
    <div className="saved-jobs-container">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading saved jobs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="saved-jobs-container">
      <div className="error-state">
        <h3>Error Loading Saved Jobs</h3>
        <p>{error}</p>
        <button onClick={fetchSavedJobs} className="btn btn-primary">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="saved-jobs-container">
      <div className="header">
        <h1>Saved Jobs</h1>
        <p>{savedJobs.length} jobs saved</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No Saved Jobs</h3>
          <p>You haven't saved any jobs yet.</p>
          <Link href="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="jobs-list">
          {savedJobs.map((savedJob) => (
            <div key={savedJob.id} className="job-card">
              <div className="job-content">
                <div className="job-company-logo">
                  <div className="logo-placeholder">
                    <FaBriefcase />
                  </div>
                </div>
                
                <div className="job-details">
                  <div className="job-header-info">
                    <h3 className="job-title">{savedJob.job_details.title}</h3>
                    <button 
                      className="unsave-btn"
                      onClick={() => unsaveJob(savedJob.id)}
                      title="Remove from saved jobs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="company-info">
                    <span className="company-name">{savedJob.job_details.company}</span>
                    <span className="company-rating">
                      <FaStar /> 4.2 | 1.2k reviews
                    </span>
                  </div>
                  
                  <div className="job-meta">
                    <span className="experience-badge">
                      {savedJob.job_details.experience_required || 'Not specified'} Yrs
                    </span>
                    <span className="salary-range">
                      <FaRupeeSign /> 
                      {savedJob.job_details.salary_min ? (
                        savedJob.job_details.salary_max ? (
                          `${savedJob.job_details.salary_min.toLocaleString()} - ${savedJob.job_details.salary_max.toLocaleString()}`
                        ) : (
                          `${savedJob.job_details.salary_min.toLocaleString()}+`
                        )
                      ) : (
                        'Not disclosed'
                      )}
                    </span>
                    <span className="job-location">
                      <FaMapMarkerAlt /> {savedJob.job_details.location}
                    </span>
                  </div>
                  
                  <div className="job-skills">
                    {savedJob.job_details.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="job-actions">
                <Link href={`/jobs/${savedJob.job_id}`} className="btn btn-outline">
                  View Details
                </Link>
                <button className="btn btn-primary">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .saved-jobs-container {
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
        
        .unsave-btn {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 1rem;
          padding: 5px;
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
        
        .experience-badge, .salary-range, .job-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          color: #666;
        }
        
        .experience-badge {
          background: #e8f4ff;
          padding: 3px 8px;
          border-radius: 4px;
          color: #0070f3;
          font-weight: 500;
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
          .job-content {
            flex-direction: column;
          }
          
          .job-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}