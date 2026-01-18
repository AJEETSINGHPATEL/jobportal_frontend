import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { FaBriefcase, FaChartBar, FaUsers, FaStar, FaPlus, FaEye, FaCheckCircle, FaSearch, FaUser, FaClock, FaEdit } from 'react-icons/fa';

export default function EmployerDashboard() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0
  });
  const [jobs, setJobs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      router.push('/login');
      return;
    }

    if (authUser.role !== 'employer') {
      // If not an employer, redirect to appropriate dashboard
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Try to get employer dashboard stats first, fallback to manual calculation
        let statsData;
        try {
          statsData = await api.getEmployerDashboardStats();
        } catch (error) {
          console.warn('Employer dashboard stats API failed, using fallback:', error);
          // Fallback: manually calculate stats from jobs and applications
          let allJobs, allApplications;
          try {
            allJobs = await api.getEmployerJobs();
          } catch {
            // Double fallback: get all jobs and filter by employer
            const allJobsResponse = await api.getAdminJobs();
            allJobs = allJobsResponse.filter(job => job.employer_id === authUser.id || job.created_by === authUser.id);
          }

          try {
            allApplications = await api.getEmployerApplications();
          } catch {
            // Get all applications and filter by employer's jobs
            const allApplicationsResponse = await api.getApplications({});
            allApplications = allApplicationsResponse.filter(app => {
              return allJobs.some(job => job.id === app.job_id || job._id === app.job_id);
            });
          }

          const totalJobs = allJobs.length;
          const activeJobs = allJobs.filter(job => job.is_active !== false).length;
          const totalApplications = allApplications.length;
          const shortlisted = allApplications.filter(app => app.status === 'shortlisted').length;

          statsData = {
            totalJobs,
            activeJobs,
            totalApplications,
            shortlisted
          };
        }
        setStats(statsData);

        // Get employer jobs
        let employerJobs;
        try {
          employerJobs = await api.getEmployerJobs();
        } catch (error) {
          console.warn('Employer jobs API failed, using fallback:', error);
          // Fallback: get all jobs and filter by employer
          const allJobs = await api.getAdminJobs();
          employerJobs = allJobs.filter(job => job.employer_id === authUser.id || job.created_by === authUser.id);
        }
        setJobs(employerJobs);
      } catch (error) {
        console.error('Error fetching employer dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivityData = async () => {
      try {
        // Get recent activity data
        let activity;
        try {
          activity = await api.getEmployerActivity();
        } catch (error) {
          console.warn('Employer activity API failed, using fallback:', error);
          // Fallback: create activity from jobs and applications
          let allApplications, allJobs;
          try {
            allApplications = await api.getEmployerApplications();
          } catch {
            // Get all applications and filter by employer's jobs
            const allApplicationsResponse = await api.getApplications({});
            allJobs = allJobs || await api.getEmployerJobs(); // Use cached value if available
            if (!allJobs) {
              const allJobsResponse = await api.getAdminJobs();
              allJobs = allJobsResponse.filter(job => job.employer_id === authUser.id || job.created_by === authUser.id);
            }
            allApplications = allApplicationsResponse.filter(app => {
              return allJobs.some(job => job.id === app.job_id || job._id === app.job_id);
            });
          }

          try {
            allJobs = allJobs || await api.getEmployerJobs(); // Use cached value if available
          } catch {
            // Double fallback for jobs
            const allJobsResponse = await api.getAdminJobs();
            allJobs = allJobsResponse.filter(job => job.employer_id === authUser.id || job.created_by === authUser.id);
          }

          const activity = [];

          // Add job posting activities
          allJobs.slice(0, 3).forEach(job => {
            if (job.created_at) {
              activity.push({
                type: 'job_posted',
                title: job.title,
                description: `Job posted: ${job.title}`,
                timestamp: new Date(job.created_at).toLocaleDateString(),
                icon: 'plus'
              });
            }
          });

          // Add application activities
          allApplications.slice(0, 5).forEach(app => {
            const job = allJobs.find(j => j.id === app.job_id || j._id === app.job_id);
            if (job) {
              activity.push({
                type: 'application_received',
                title: app.applicant_name || 'Applicant',
                description: `${app.applicant_name || 'Someone'} applied for ${job.title}`,
                timestamp: new Date(app.timestamp || app.created_at).toLocaleDateString(),
                icon: 'user'
              });
            }
          });

          // Add shortlist activities
          const shortlistedApps = allApplications.filter(app => app.status === 'shortlisted');
          shortlistedApps.forEach(app => {
            const job = allJobs.find(j => j.id === app.job_id || j._id === app.job_id);
            if (job) {
              activity.push({
                type: 'shortlisted',
                title: app.applicant_name || 'Applicant',
                description: `${app.applicant_name || 'Applicant'} shortlisted for ${job.title}`,
                timestamp: new Date(app.updated_at || app.timestamp).toLocaleDateString(),
                icon: 'star'
              });
            }
          });

          // Sort by most recent
          activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }

        // Process the activity data to format timestamps
        const formattedActivity = activity.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp).toLocaleDateString()
        }));

        setRecentActivity(formattedActivity);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        // Set default activities if API fails
        setRecentActivity([
          { type: 'job_posted', title: 'Senior Developer', description: 'Job posted: Senior Developer', timestamp: 'Just now', icon: 'plus' },
          { type: 'application_received', title: 'John Doe', description: 'John Doe applied for UX Designer', timestamp: '2 hours ago', icon: 'user' },
          { type: 'shortlisted', title: 'Sarah Johnson', description: 'Sarah Johnson shortlisted for Senior Developer', timestamp: '1 day ago', icon: 'star' }
        ]);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchData();
    fetchActivityData();
  }, [authUser, router]);

  const handleStatClick = (statType) => {
    // Check if user is authenticated before navigating
    if (!authUser) {
      router.push('/login');
      return;
    }

    switch (statType) {
      case 'totalJobs':
        router.push('/dashboard/jobs/my-jobs'); // Navigate to employer's jobs page
        break;
      case 'activeJobs':
        router.push('/dashboard/jobs/my-jobs'); // Navigate to employer's jobs page
        break;
      case 'totalApplications':
        router.push('/dashboard/applications'); // Navigate to applications page
        break;
      case 'shortlisted':
        router.push('/dashboard/applications?status=shortlisted'); // Navigate to shortlisted candidates
        break;
      default:
        break;
    }
  };

  const handleQuickAction = (action) => {
    // Check if user is authenticated before navigating
    if (!authUser) {
      router.push('/login');
      return;
    }

    switch (action) {
      case 'postJob':
        router.push('/post-job');
        break;
      case 'searchCandidates':
        router.push('/recruiters/search');
        break;
      case 'viewAnalytics':
        router.push('/analytics');
        break;
      default:
        break;
    }
  };

  const handleActivityClick = (activity) => {
    // Check if user is authenticated before navigating
    if (!authUser) {
      router.push('/login');
      return;
    }

    switch (activity.type) {
      case 'job_posted':
        router.push('/dashboard/jobs/my-jobs');
        break;
      case 'application_received':
        router.push('/dashboard/applications');
        break;
      case 'shortlisted':
        router.push('/dashboard/applications?status=shortlisted');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Employer Dashboard</h1>
          <p>Manage your job postings and candidates</p>
        </div>
      </div>

      {/* Stats Cards - Made clickable */}
      <div className="stats-container">
        <div className="stat-card clickable" onClick={() => handleStatClick('totalJobs')}>
          <div className="stat-icon bg-primary">
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <h3>{stats.totalJobs}</h3>
            <p>Total Jobs</p>
          </div>
        </div>

        <div className="stat-card clickable" onClick={() => handleStatClick('activeJobs')}>
          <div className="stat-icon bg-success">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>

        <div className="stat-card clickable" onClick={() => handleStatClick('totalApplications')}>
          <div className="stat-icon bg-info">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.totalApplications}</h3>
            <p>Applications</p>
          </div>
        </div>

        <div className="stat-card clickable" onClick={() => handleStatClick('shortlisted')}>
          <div className="stat-icon bg-warning">
            <FaStar />
          </div>
          <div className="stat-info">
            <h3>{stats.shortlisted}</h3>
            <p>Shortlisted</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-left">
          <div className="card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="card-body">
              <button className="action-button primary" onClick={() => handleQuickAction('postJob')}>
                <FaPlus /> Post New Job
              </button>
              <button className="action-button secondary" onClick={() => handleQuickAction('searchCandidates')}>
                <FaSearch /> Search Candidates
              </button>
              <button className="action-button tertiary" onClick={() => handleQuickAction('viewAnalytics')}>
                <FaChartBar /> View Analytics
              </button>
            </div>
          </div>

          <div className="card" id="jobs">
            <div className="card-header">
              <h2>My Job Postings</h2>
              <button className="view-all" onClick={() => handleStatClick('totalJobs')}>
                View All
              </button>
            </div>
            <div className="card-body">
              {jobs && jobs.length > 0 ? (
                <div className="jobs-list">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job.id || job._id} className="job-item">
                      <div className="job-info">
                        <h3>{job.title || 'Untitled Position'}</h3>
                        <p>{job.location}</p>
                        <div className="job-stats">
                          <span><FaUsers /> {job.application_count || 0} applicants</span>
                          <span><FaEye /> {job.view_count || 0} views</span>
                        </div>
                      </div>
                      <div className="job-meta">
                        <span className={`status-badge ${job.is_active ? 'success' : 'danger'}`}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <div className="job-actions">
                          <button
                            className="icon-button"
                            onClick={() => router.push(`/jobs/${job.id || job._id}`)}
                            title="View"
                          >
                            View
                          </button>
                          <button
                            className="icon-button"
                            onClick={() => router.push(`/dashboard/jobs/edit/${job.id || job._id}`)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No job postings found. <a href="/post-job">Post your first job</a> to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          <div className="card">
            <div className="card-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="card-body">
              {activityLoading ? (
                <div className="activity-loading">
                  <div className="spinner-small"></div>
                  <p>Loading activity...</p>
                </div>
              ) : (
                <div className="activity-list">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="activity-item clickable"
                        onClick={() => handleActivityClick(activity)}
                      >
                        <div className={`activity-icon bg-${activity.icon === 'user' ? 'green' : activity.icon === 'star' ? 'purple' : 'blue'}`}>
                          {activity.icon === 'user' ? <FaUser /> :
                            activity.icon === 'star' ? <FaStar /> :
                              <FaPlus />}
                        </div>
                        <div className="activity-content">
                          <p><strong>{activity.description}</strong></p>
                          <p className="activity-time">
                            <FaClock /> {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #0070f3 0%, #0055cc 100%);
          color: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .header-content p {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .clickable {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .clickable:hover {
          transform: translateY(-3px);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .bg-primary { background: #0070f3; }
        .bg-success { background: #28a745; }
        .bg-info { background: #17a2b8; }
        .bg-warning { background: #ffc107; color: #212529; }

        .stat-info h3 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }

        .stat-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .dashboard-main {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h2 {
          margin: 0;
          color: #333;
        }

        .view-all {
          background: transparent;
          border: none;
          color: #0070f3;
          cursor: pointer;
          font-weight: 500;
          text-decoration: underline;
        }

        .card-body {
          padding: 1.5rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 6px;
          margin-bottom: 10px;
          cursor: pointer;
          font-weight: 500;
        }

        .action-button.primary {
          background: #0070f3;
          color: white;
        }

        .action-button.secondary {
          background: #e9ecef;
          color: #495057;
        }

        .action-button.tertiary {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .job-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .job-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .job-info h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .job-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .job-stats {
          display: flex;
          gap: 15px;
          margin-top: 5px;
        }

        .job-stats span {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: #666;
        }

        .job-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .success {
          background: #d4edda;
          color: #155724;
        }

        .danger {
          background: #f8d7da;
          color: #721c24;
        }

        .job-actions {
          display: flex;
          gap: 5px;
        }

        .icon-button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          flex-shrink: 0;
        }

        .bg-blue { background: #0070f3; }
        .bg-green { background: #28a745; }
        .bg-purple { background: #6f42c1; }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          margin: 0 0 3px 0;
          color: #333;
        }

        .activity-time {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0070f3;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 10px;
        }

        .activity-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #666;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .dashboard-main {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
          
          .job-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .job-meta {
            width: 100%;
            align-items: flex-start;
          }
          
          .job-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}