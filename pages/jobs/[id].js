import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import Link from 'next/link';
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaClock, FaGraduationCap, FaClipboardList, FaUserFriends, FaShareAlt, FaHeart, FaArrowLeft, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

export default function JobDetails({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getJobById(id);
      if (response.success) {
        setJob(response.data);
      } else {
        throw new Error('Failed to load job details');
      }
    } catch (err) {
      setError('Failed to load job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = async () => {
    // In a real app, you would redirect to application form or show modal
    if (!user) {
      alert('Please log in to apply for jobs');
      return;
    }
    
    // Check if the job exists in our local database by attempting to fetch it
    try {
      await api.getJobById(id);
      // If successful, the job exists locally, proceed normally
      router.push(`/apply/${id}`);
    } catch (err) {
      // If it fails, it might be an external Adzuna job
      // Create a local copy of the job first, then apply
      try {
        // Create a simplified job object based on the current job data
        const jobToCreate = {
          title: job.title,
          description: job.description || job.description,
          company: job.company,
          location: job.location,
          salary_min: job.salary?.min || job.salary_min,
          salary_max: job.salary?.max || job.salary_max,
          job_type: job.jobType || job.job_type,
          work_mode: job.workMode || job.work_mode,
          skills: job.skills || [],
          experience_required: job.experience_required || 'Not specified',
          posted_date: new Date().toISOString(),
          is_active: true
        };
        
        // Create the job in our local database
        const createdJob = await api.createJob(jobToCreate);
        
        // Now redirect to apply using the new local job ID
        router.push(`/apply/${createdJob.id}`);
      } catch (createErr) {
        console.error('Error creating local job copy:', createErr);
        alert('Error preparing job application. Please try again.');
      }
    }
  };

  const handleSaveJob = () => {
    // In a real app, you would save the job to user's saved jobs
    setIsSaved(!isSaved);
  };

  const handleShareJob = () => {
    // In a real app, you would implement sharing functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Job link copied to clipboard!');
  };

  const handleEditJob = () => {
    router.push(`/jobs/${id}/edit`);
  };

  const handleDeleteJob = async () => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await api.deleteJob(id);
        router.push('/jobs');
      } catch (err) {
        alert('Error deleting job: ' + err.message);
      }
    }
  };

  if (loading) return (
    <div className="job-details-container">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="job-details-container">
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Job Details</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={fetchJobDetails} className="btn btn-primary">Retry</button>
          <Link href="/jobs" className="btn btn-outline">
            <FaArrowLeft /> Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );

  if (!job) return (
    <div className="job-details-container">
      <div className="error-message">
        <h3>Job Not Found</h3>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <Link href="/jobs" className="btn btn-primary">
          <FaArrowLeft /> Back to Jobs
        </Link>
      </div>
    </div>
  );

  return (
    <div className="job-details-container">
      {/* Header */}
      <div className="job-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => router.push('/jobs')}
          >
            <FaArrowLeft /> Back to Jobs
          </button>
          
          <div className="job-title-section">
            <h1>{job.title || 'Untitled Position'}</h1>
            <p>{job.company || 'Company not specified'}</p>
          </div>
          
          <div className="job-actions">
            <button 
              className={`action-button ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveJob}
            >
              <FaHeart /> {isSaved ? 'Saved' : 'Save'}
            </button>
            <button 
              className="action-button"
              onClick={handleShareJob}
            >
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="job-details-content">
        {/* Main Content */}
        <div className="main-content">
          {/* Job Overview */}
          <div className="job-overview">
            <h2>Job Overview</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <FaMapMarkerAlt />
                <div>
                  <h4>Location</h4>
                  <p>{job.location || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="overview-item">
                <FaDollarSign />
                <div>
                  <h4>Salary</h4>
                  <p>
                    {job.salary && (job.salary.min || job.salary.max) ? 
                     `$${job.salary.min?.toLocaleString() || '0'} - $${job.salary.max?.toLocaleString() || '0'}` : 
                     'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="overview-item">
                <FaClock />
                <div>
                  <h4>Job Type</h4>
                  <p>{job.jobType ? job.jobType.replace('_', ' ').toUpperCase() : 'Not specified'}</p>
                </div>
              </div>
              
              <div className="overview-item">
                <FaGraduationCap />
                <div>
                  <h4>Experience</h4>
                  <p>{job.experience_required || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="job-section">
            <h2>Job Description</h2>
            <div className="section-content">
              {job.description ? (
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              ) : (
                <p>No description provided for this position.</p>
              )}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="job-section">
              <h2>Responsibilities</h2>
              <div className="section-content">
                <ul>
                  {job.responsibilities.split('\n').map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="job-section">
              <h2>Requirements</h2>
              <div className="section-content">
                <ul>
                  {job.requirements.split('\n').map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="job-section">
              <h2>Benefits</h2>
              <div className="section-content">
                <ul>
                  {job.benefits.split('\n').map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="job-section">
              <h2>Required Skills</h2>
              <div className="section-content">
                <div className="skills-container">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Apply for this job</h3>
            <button className="btn btn-primary btn-block" onClick={handleApplyClick}>
              Apply Now
            </button>
            <button className="btn btn-outline btn-block" onClick={handleSaveJob}>
              <FaHeart /> {isSaved ? 'Saved' : 'Save Job'}
            </button>
          </div>

          <div className="sidebar-card">
            <h3>Job Details</h3>
            <div className="job-detail-item">
              <strong>Work Mode:</strong>
              <span>{job.workMode || 'Not specified'}</span>
            </div>
            <div className="job-detail-item">
              <strong>Posted:</strong>
              <span>{job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Not specified'}</span>
            </div>
            <div className="job-detail-item">
              <strong>Applications:</strong>
              <span>{job.application_count || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .job-header {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          font-size: 1rem;
          padding: 8px 16px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #f0f0f0;
        }

        .job-title-section h1 {
          margin: 0 0 8px 0;
          font-size: 1.8rem;
          color: #333;
        }

        .job-title-section p {
          margin: 0;
          color: #666;
          font-size: 1.1rem;
        }

        .job-actions {
          display: flex;
          gap: 10px;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #ddd;
          color: #333;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .action-button:hover {
          background: #f5f5f5;
          border-color: #bbb;
        }

        .action-button.saved {
          color: #e00;
          border-color: #e00;
        }

        .job-details-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .job-overview {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .job-overview h2 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .overview-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .overview-item svg {
          color: #0070f3;
          font-size: 1.2rem;
          margin-top: 2px;
        }

        .overview-item h4 {
          margin: 0 0 4px 0;
          color: #333;
          font-size: 0.9rem;
        }

        .overview-item p {
          margin: 0;
          color: #666;
          font-size: 1rem;
        }

        .job-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .job-section h2 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .section-content {
          color: #555;
          line-height: 1.6;
        }

        .section-content ul {
          padding-left: 20px;
        }

        .section-content li {
          margin-bottom: 8px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .skill-badge {
          background: #f0f0f0;
          color: #333;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-card h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .btn-block {
          width: 100%;
          margin-bottom: 10px;
        }

        .job-detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .job-detail-item:last-child {
          border-bottom: none;
        }

        .job-detail-item strong {
          color: #333;
        }

        .job-detail-item span {
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

        .loading-spinner {
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

        .error-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .error-state h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .error-state p {
          margin: 0 0 20px 0;
          color: #666;
        }

        .error-actions {
          display: flex;
          gap: 15px;
        }

        .error-message {
          background: white;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .error-message h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .error-message p {
          margin: 0 0 25px 0;
          color: #666;
        }

        @media (max-width: 768px) {
          .job-details-container {
            padding: 10px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .job-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .job-details-content {
            grid-template-columns: 1fr;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}