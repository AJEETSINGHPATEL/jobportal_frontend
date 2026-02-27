import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { FaUser, FaBriefcase, FaFileAlt, FaChartBar, FaHeart, FaBell, FaRobot, FaSearch, FaComments, FaBolt, FaUsers, FaPlus, FaCalendar, FaMoneyBillWave, FaGraduationCap, FaStar, FaArrowRight, FaLightbulb, FaThumbsUp, FaClock, FaCheckCircle, FaEye } from 'react-icons/fa';
import StatCard from '../components/dashboard/StatCard';

export default function Dashboard() {
  const router = useRouter();
  const { user: authUser, login } = useAuth();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    savedJobs: 0,
    profileCompleteness: 0,
    profileViews: 0,
    resumeUploaded: false,
    totalJobs: 0,
    activeJobs: 0,
    totalApplicationsReceived: 0,
    shortlisted: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      router.push('/login');
      return;
    }

    // Update user state when authUser changes (e.g., profile picture update)
    setUser(authUser);

    // If profile exists and authUser has an updated profile picture, update the profile state as well
    if (profile && authUser.profilePicture) {
      setProfile(prevProfile => ({
        ...prevProfile,
        profilePicture: authUser.profilePicture
      }));
    }

    const fetchData = async () => {
      try {
        if (authUser.role === 'job_seeker') {
          // Job seeker dashboard data
          // Get user applications
          const applications = await api.getApplications({ user_id: authUser.id });
          const totalApplications = applications.length || 0;

          // Get user profile
          try {
            const userProfile = await api.getUserProfile(authUser.id);
            setProfile(userProfile);

            // Calculate profile completeness
            let profileCompleteness = 0;
            if (userProfile) {
              const fields = ['fullName', 'email', 'phone', 'address', 'headline', 'summary', 'skills', 'experience', 'education'];
              const filledFields = fields.filter(field => {
                if (field === 'skills') return userProfile.skills && userProfile.skills.length > 0;
                if (field === 'experience') return userProfile.experience && userProfile.experience.length > 0;
                if (field === 'education') return userProfile.education && userProfile.education.length > 0;
                return userProfile[field] && userProfile[field].trim() !== '';
              });
              profileCompleteness = Math.round((filledFields.length / fields.length) * 100);
            }

            // Check if resume is uploaded
            let resumeUploaded = false;
            try {
              const userResumes = await api.getUserResumes(authUser.id);
              resumeUploaded = userResumes && userResumes.length > 0;
            } catch (error) {
              resumeUploaded = false;
            }

            setStats({
              totalApplications,
              savedJobs: 0, // We'll fetch this separately
              profileCompleteness,
              profileViews: userProfile?.profile_views || 0,
              resumeUploaded,
              totalJobs: 0,
              activeJobs: 0,
              totalApplicationsReceived: 0,
              shortlisted: 0
            });

            // Get saved jobs
            try {
              const savedJobsResponse = await api.request('/api/saved-jobs/');
              const savedJobs = savedJobsResponse.length || 0;
              setStats(prev => ({ ...prev, savedJobs }));
            } catch (error) {
              console.error('Error fetching saved jobs:', error);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Set default values if profile doesn't exist
            setStats({
              totalApplications,
              savedJobs: 0,
              profileCompleteness: 30, // Default if no profile
              profileViews: 0,
              resumeUploaded: false,
              totalJobs: 0,
              activeJobs: 0,
              totalApplicationsReceived: 0,
              shortlisted: 0
            });
          }

          // Get recent activity
          setRecentActivity([
            { id: 1, type: 'application', title: 'Applied for Frontend Developer', date: '2 hours ago', status: 'submitted', icon: <FaBriefcase /> },
            { id: 2, type: 'saved', title: 'Saved Senior React Developer', date: '1 day ago', status: 'saved', icon: <FaHeart /> },
            { id: 3, type: 'ai_analysis', title: 'Resume analyzed by AI', date: '2 days ago', status: 'completed', icon: <FaRobot /> },
            { id: 4, type: 'profile_update', title: 'Updated profile information', date: '3 days ago', status: 'completed', icon: <FaUser /> },
            { id: 5, type: 'interview', title: 'Interview scheduled for Product Manager', date: '4 days ago', status: 'scheduled', icon: <FaComments /> }
          ]);

          // Get recommended jobs
          setRecommendedJobs([
            { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$80k - $120k', type: 'Full-time' },
            { id: 2, title: 'UX/UI Designer', company: 'DesignStudio', location: 'San Francisco', salary: '$70k - $100k', type: 'Full-time' },
            { id: 3, title: 'DevOps Engineer', company: 'CloudSystems', location: 'New York', salary: '$90k - $140k', type: 'Contract' }
          ]);
        } else if (authUser.role === 'employer') {
          // Employer dashboard data
          try {
            // Get employer jobs
            const jobsResponse = await fetch('/api/jobs?employer_id=' + authUser.id, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            const jobs = await jobsResponse.json();
            const totalJobs = jobs.length || 0;
            const activeJobs = jobs.filter(job => job.is_active).length || 0;

            // Get applications received
            const applicationsResponse = await fetch('/api/applications?employer_id=' + authUser.id, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            const applications = await applicationsResponse.json();
            const totalApplicationsReceived = applications.length || 0;
            const shortlisted = applications.filter(app => app.status === 'shortlisted').length || 0;

            setStats({
              totalApplications: 0,
              savedJobs: 0,
              profileCompleteness: 0,
              profileViews: 0,
              resumeUploaded: false,
              totalJobs,
              activeJobs,
              totalApplicationsReceived,
              shortlisted
            });

            // Mock recent activity for employers
            setRecentActivity([
              { id: 1, type: 'job_posted', title: 'Posted Frontend Developer position', date: '1 hour ago', status: 'posted', icon: <FaBriefcase /> },
              { id: 2, type: 'application_received', title: 'Received application from John Doe', date: '3 hours ago', status: 'received', icon: <FaChartBar /> },
              { id: 3, type: 'candidate_shortlisted', title: 'Shortlisted Jane Smith', date: '1 day ago', status: 'shortlisted', icon: <FaUsers /> },
              { id: 4, type: 'job_updated', title: 'Updated Senior React position', date: '2 days ago', status: 'updated', icon: <FaBriefcase /> },
              { id: 5, type: 'offer_sent', title: 'Sent offer to Mike Johnson', date: '3 days ago', status: 'sent', icon: <FaStar /> }
            ]);
          } catch (error) {
            console.error('Error fetching employer data:', error);
            // Set default values
            setStats({
              totalApplications: 0,
              savedJobs: 0,
              profileCompleteness: 0,
              profileViews: 0,
              resumeUploaded: false,
              totalJobs: 0,
              activeJobs: 0,
              totalApplicationsReceived: 0,
              shortlisted: 0
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, router]);

  // Effect to update profile picture when authUser changes (e.g., after profile update)
  useEffect(() => {
    if (authUser && authUser.profilePicture) {
      // Update both the user state and profile state when profile picture changes
      setUser(prevUser => ({
        ...prevUser,
        profilePicture: authUser.profilePicture
      }));

      if (profile) {
        setProfile(prevProfile => ({
          ...prevProfile,
          profilePicture: authUser.profilePicture
        }));
      }
    }
  }, [authUser?.profilePicture]);

  // Function to refresh user profile data
  const refreshProfile = async () => {
    if (authUser && authUser.id) {
      try {
        const userProfile = await api.getUserProfile(authUser.id);
        setProfile(userProfile);

        // Update auth context with new profile data
        const updatedUser = {
          ...authUser,
          profilePicture: userProfile.profilePicture || userProfile.profile_picture || authUser.profilePicture,
          profile_completion: userProfile.profile_completion
        };

        // Call login again to update the auth context with fresh profile data
        login(updatedUser, localStorage.getItem('token'));
        setUser(updatedUser);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const renderJobSeekerContent = () => {
    const statCards = [
      {
        id: 'applications',
        title: 'Applications Submitted',
        value: stats.totalApplications,
        icon: <FaBriefcase />,
        color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        bgColor: '#eff6ff',
        textColor: '#1d4ed8',
        link: '/applications'
      },
      {
        id: 'saved-jobs',
        title: 'Saved Jobs',
        value: stats.savedJobs,
        icon: <FaHeart />,
        color: 'linear-gradient(135deg, #ef4444, #dc2626)',
        bgColor: '#fef2f2',
        textColor: '#dc2626',
        link: '/jobs'
      },
      {
        id: 'profile-completeness',
        title: 'Profile Completeness',
        value: `${stats.profileCompleteness}%`,
        icon: <FaUser />,
        color: 'linear-gradient(135deg, #10b981, #047857)',
        bgColor: '#f0fdf4',
        textColor: '#047857',
        link: '/profile'
      },
      {
        id: 'resume-uploaded',
        title: 'Resume Status',
        value: stats.resumeUploaded ? 'Uploaded' : 'Not Uploaded',
        icon: <FaFileAlt />,
        color: stats.resumeUploaded ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #eab308, #a16207)',
        bgColor: stats.resumeUploaded ? '#f0fdf4' : '#fefce8',
        textColor: stats.resumeUploaded ? '#047857' : '#a16207',
        link: '/resume'
      }
    ];

    // Add Profile Views card specifically requested
    const profileViewsCard = {
      id: 'profile-views',
      title: 'Profile Views',
      value: stats.profileViews,
      icon: <FaEye />,
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      bgColor: '#f5f3ff',
      textColor: '#7c3aed',
      link: '/profile'
    };

    // Insert Profile Views card after saved jobs
    const statCardsWithViews = [
      statCards[0],
      statCards[1],
      profileViewsCard,
      statCards[2],
      statCards[3]
    ];

    const quickActions = [
      {
        id: 'ai-resume-analyzer',
        title: 'AI Resume Analyzer',
        description: 'Get instant feedback on your resume',
        icon: <FaRobot />,
        link: '/ai-resume-analyzer',
        gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
      },
      {
        id: 'ai-cover-letter',
        title: 'AI Cover Letter',
        description: 'Generate personalized cover letters',
        icon: <FaBolt />,
        link: '/ai-cover-letter',
        gradient: 'linear-gradient(135deg, #10b981, #047857)'
      },
      {
        id: 'job-search',
        title: 'Find Jobs',
        description: 'Browse thousands of job listings',
        icon: <FaSearch />,
        link: '/jobs',
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      },
      {
        id: 'knowledge-base',
        title: 'Knowledge Base',
        description: 'View insights from your previous chats',
        icon: <FaChartBar />,
        link: '/knowledge-base',
        gradient: 'linear-gradient(135deg, #ec4899, #be185d)'
      },
      {
        id: 'interview-prep',
        title: 'Interview Prep',
        description: 'Practice with AI-generated questions',
        icon: <FaComments />,
        link: '/ai-interview-prep',
        gradient: 'linear-gradient(135deg, #f97316, #ea580c)'
      }
    ];

    return (
      <>
        {/* Welcome Section */}
        <div style={{
          width: '100%'
        }}>


          <div className="welcome-section" style={{ marginBottom: '2rem' }}>
            <div className="welcome-card" style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div className="welcome-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #3b82f6',
                    flexShrink: 0
                  }}>
                    {profile?.profilePicture ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}${profile.profilePicture}`}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80?text=User';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: '#9ca3af'
                      }}>
                        <FaUser />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      Welcome back, {user?.full_name || user?.email || 'Job Seeker'}!
                    </h2>
                    <p style={{
                      color: '#4b5563',
                      margin: 0
                    }}>
                      Ready to take the next step in your career journey?
                    </p>
                  </div>
                </div>
              </div>
              <div className="welcome-stats" style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '1rem'
              }}>
                <div className="stat-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaBriefcase style={{ color: '#3b82f6', fontSize: '1.25rem' }} />
                  <div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>{stats.totalApplications}</div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>Applications</div>
                  </div>
                </div>
                <div className="stat-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaHeart style={{ color: '#ef4444', fontSize: '1.25rem' }} />
                  <div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>{stats.savedJobs}</div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>Saved Jobs</div>
                  </div>
                </div>
                <div className="stat-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaUser style={{ color: '#10b981', fontSize: '1.25rem' }} />
                  <div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>{stats.profileCompleteness}%</div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>Profile</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>Your Progress</h2>
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {statCardsWithViews.map(card => (
                <StatCard key={card.id} {...card} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>Quick Actions</h2>
            <div className="quick-actions-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {quickActions.map(action => (
                <div
                  key={action.id}
                  className="quick-action-card"
                  onClick={() => router.push(action.link)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: action.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginBottom: '1rem',
                    transition: 'transform 0.3s ease'
                  }} className="action-icon">
                    {action.icon}
                  </div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>{action.title}</h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem'
                  }}>{action.description}</p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#3b82f6',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Get Started <FaArrowRight style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="recommended-section" style={{ marginBottom: '2rem' }}>
            <div className="section-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>Recommended for You</h2>
              <button
                style={{
                  color: '#3b82f6',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onClick={() => router.push('/jobs')}
              >
                View All
              </button>
            </div>
            <div className="recommended-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {recommendedJobs.map(job => (
                <div
                  key={job.id}
                  className="job-card"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  <div className="job-header">
                    <h3 style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>{job.title}</h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>{job.company} • {job.location}</p>
                  </div>
                  <div className="job-details">
                    <div className="job-meta" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        color: '#047857',
                        fontWeight: '500'
                      }}>{job.salary}</span>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: '#6b7280'
                      }}>{job.type}</span>
                    </div>
                  </div>
                  <button
                    className="apply-btn"
                    style={{
                      marginTop: '1rem',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderEmployerContent = () => {
    const statCards = [
      {
        id: 'total-jobs',
        title: 'Total Jobs',
        value: stats.totalJobs,
        icon: <FaBriefcase />,
        color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        bgColor: '#eff6ff',
        textColor: '#1d4ed8',
        link: '/employer-dashboard'
      },
      {
        id: 'active-jobs',
        title: 'Active Jobs',
        value: stats.activeJobs,
        icon: <FaUser />,
        color: 'linear-gradient(135deg, #10b981, #047857)',
        bgColor: '#f0fdf4',
        textColor: '#047857',
        link: '/employer-dashboard'
      },
      {
        id: 'applications-received',
        title: 'Applications Received',
        value: stats.totalApplicationsReceived,
        icon: <FaChartBar />,
        color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        bgColor: '#f5f3ff',
        textColor: '#7c3aed',
        link: '/dashboard/applications'
      },
      {
        id: 'shortlisted',
        title: 'Shortlisted Candidates',
        value: stats.shortlisted,
        icon: <FaUsers />,
        color: 'linear-gradient(135deg, #f59e0b, #d97706)',
        bgColor: '#fffbeb',
        textColor: '#d97706',
        link: '/dashboard/candidates'
      }
    ];

    const quickActions = [
      {
        id: 'post-job',
        title: 'Post New Job',
        description: 'Create and publish new job listings',
        icon: <FaPlus />,
        link: '/post-job',
        gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
      },
      {
        id: 'manage-jobs',
        title: 'Manage Jobs',
        description: 'View and update your job postings',
        icon: <FaBriefcase />,
        link: '/employer-dashboard',
        gradient: 'linear-gradient(135deg, #10b981, #047857)'
      },
      {
        id: 'view-applicants',
        title: 'View Applicants',
        description: 'See all candidates who applied to your jobs',
        icon: <FaUsers />,
        link: '/candidates',
        gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'View statistics about your job postings',
        icon: <FaChartBar />,
        link: '/analytics',
        gradient: 'linear-gradient(135deg, #f97316, #ea580c)'
      }
    ];

    return (
      <>
        {/* Welcome Section */}
        <div className="welcome-section" style={{ marginBottom: '2rem' }}>
          <div className="welcome-card" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div className="welcome-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #3b82f6',
                  flexShrink: 0
                }}>
                  {authUser?.profilePicture ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}${authUser.profilePicture}`}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80?text=Employer';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: '#9ca3af'
                    }}>
                      <FaUser />
                    </div>
                  )}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.25rem'
                  }}>
                    Welcome back, {user?.full_name || user?.email || 'Employer'}!
                  </h2>
                  <p style={{
                    color: '#4b5563',
                    margin: 0
                  }}>
                    Manage your job postings and find the best candidates.
                  </p>
                </div>
              </div>
            </div>
            <div className="welcome-stats" style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '1rem'
            }}>
              <div className="stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaBriefcase style={{ color: '#3b82f6', fontSize: '1.25rem' }} />
                <div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>{stats.totalJobs}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>Total Jobs</div>
                </div>
              </div>
              <div className="stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaChartBar style={{ color: '#8b5cf6', fontSize: '1.25rem' }} />
                <div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>{stats.totalApplicationsReceived}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>Applications</div>
                </div>
              </div>
              <div className="stat-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaUsers style={{ color: '#f59e0b', fontSize: '1.25rem' }} />
                <div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>{stats.shortlisted}</div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>Shortlisted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Your Business Metrics</h2>
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {statCards.map(card => (
              <div
                key={card.id}
                className={`stat-card ${card.bgColor} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                onClick={() => router.push(card.link)}
                style={{
                  backgroundColor: card.bgColor,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  borderRadius: '12px',
                  background: card.color,
                  color: 'white'
                }}>
                  {card.icon}
                </div>
                <div className="stat-info">
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0'
                  }}>{card.value}</h3>
                  <p style={{
                    margin: '0',
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>{card.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section" style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Quick Actions</h2>
          <div className="quick-actions-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {quickActions.map(action => (
              <div
                key={action.id}
                className="quick-action-card"
                onClick={() => router.push(action.link)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: action.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '1rem',
                  transition: 'transform 0.3s ease'
                }} className="action-icon">
                  {action.icon}
                </div>
                <h3 style={{
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>{action.title}</h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem'
                }}>{action.description}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Get Started <FaArrowRight style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #3b82f6',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            width: '4rem',
            height: '4rem',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#4b5563' }}>Loading your dashboard...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Dashboard Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            borderRadius: '16px',
            padding: '2rem',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h1 style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  {user?.role === 'job_seeker' ? 'Job Seeker Dashboard' : 'Employer Dashboard'}
                </h1>
                <p style={{
                  color: '#dbeafe',
                  fontSize: '1.125rem'
                }}>
                  {user?.role === 'job_seeker'
                    ? 'Your career journey starts here'
                    : 'Find and hire the best talent'}
                </p>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {profile && profile.profilePicture ? (
                      <img
                        src={profile.profilePicture}
                        alt="Profile"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '0.75rem',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          cursor: 'pointer'
                        }}
                        onClick={() => router.push('/profile')}
                      />
                    ) : (
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        cursor: 'pointer'
                      }}
                        onClick={() => router.push('/profile')}>
                        <FaUser style={{ color: 'white', fontSize: '1.25rem' }} />
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: '500', margin: '0' }}>{user?.full_name || user?.email || 'User'}</p>
                      <p style={{ fontSize: '0.875rem', color: '#dbeafe', margin: '0', textTransform: 'capitalize' }}>{user?.role || 'User'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user?.role === 'job_seeker' ? renderJobSeekerContent() : renderEmployerContent()}

        {/* Recent Activity */}
        <div className="activity-section" style={{ marginTop: '2rem' }}>
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>Recent Activity</h2>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div
                key={activity.id}
                className="activity-item"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#dbeafe',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontWeight: '500',
                      color: '#1f2937',
                      margin: '0'
                    }}>{activity.title}</h4>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      margin: '0'
                    }}>{activity.date}</p>
                  </div>
                  <div className="activity-status">
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: activity.status === 'submitted' || activity.status === 'completed' || activity.status === 'posted' || activity.status === 'received' || activity.status === 'shortlisted' || activity.status === 'scheduled' || activity.status === 'sent' ? '#dcfce7' : '#f3f4f6',
                      color: activity.status === 'submitted' || activity.status === 'completed' || activity.status === 'posted' || activity.status === 'received' || activity.status === 'shortlisted' || activity.status === 'scheduled' || activity.status === 'sent' ? '#166534' : '#6b7280'
                    }}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}