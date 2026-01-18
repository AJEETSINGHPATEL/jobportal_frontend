import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import Link from 'next/link';
import { FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter, FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaStar, FaHeart, FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function JobsPage({ user }) {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    minSalary: '',
    maxSalary: '',
    experienceMin: '',
    experienceMax: ''
  });
  const [expandedFilters, setExpandedFilters] = useState({
    workMode: true,
    experience: true,
    department: true,
    salary: true,
    location: true
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 20;

  useEffect(() => {
    fetchJobs();
  }, [filter, searchFilters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Use the new advanced search endpoint
      const filters = {};
      
      // Add search filters
      if (searchFilters.search) filters.search = searchFilters.search;
      if (searchFilters.location) filters.location = searchFilters.location;
      if (searchFilters.jobType) filters.job_type = searchFilters.jobType;
      if (searchFilters.workMode) filters.work_mode = searchFilters.workMode;
      if (searchFilters.minSalary) filters.salary_min = parseInt(searchFilters.minSalary);
      if (searchFilters.experienceMin) filters.experience_min = parseInt(searchFilters.experienceMin);
      if (searchFilters.experienceMax) filters.experience_max = parseInt(searchFilters.experienceMax);
      if (searchFilters.skills && searchFilters.skills.length > 0) {
        filters.skills = searchFilters.skills;
      }
      
      // Use the new search endpoint
      const jobsData = await api.searchJobs(filters);
      setJobs(jobsData);
    } catch (err) {
      setError(err.message);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        // In a real app, you would call the API to delete the job
        await api.deleteJob(jobId);
        fetchJobs(); // Refresh the list
      } catch (err) {
        alert('Error deleting job: ' + err.message);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchFilters({
      search: '',
      location: '',
      jobType: '',
      minSalary: '',
      maxSalary: '',
      experienceMin: '',
      experienceMax: ''
    });
  };

  if (loading) return (
    <div className="jobs-container">
      <div className="layout-container">
        <aside className="filter-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Filters</h3>
            </div>
            <div className="filter-content">
              <div className="loading-placeholder">
                <p>Loading filters...</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="jobs-main">
          <div className="jobs-header">
            <div className="header-content">
              <h1>{user?.role === 'employer' ? 'My Job Postings' : 'Available Jobs'}</h1>
            </div>
          </div>
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        </main>
      </div>
    </div>
  );

  if (error) return (
    <div className="jobs-container">
      <div className="layout-container">
        <aside className="filter-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Filters</h3>
            </div>
            <div className="filter-content">
              <div className="error-placeholder">
                <p>Filters unavailable</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="jobs-main">
          <div className="jobs-header">
            <div className="header-content">
              <h1>{user?.role === 'employer' ? 'My Job Postings' : 'Available Jobs'}</h1>
            </div>
          </div>
          <div className="error-state">
            <h3>Error Loading Jobs</h3>
            <p>{error}</p>
            <button onClick={fetchJobs} className="btn btn-primary">Retry</button>
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <div className="jobs-container">
      <div className="layout-container">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            </div>
            
            <div className="filter-content">
              {/* Work Mode Filter */}
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilterSection('workMode')}
                >
                  <h4>Work Mode</h4>
                  <span>{expandedFilters.workMode ? <FaChevronDown /> : <FaChevronRight />}</span>
                </div>
                {expandedFilters.workMode && (
                  <div className="filter-options">
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="jobType" 
                        value="remote" 
                        checked={searchFilters.jobType === 'remote'}
                        onChange={handleFilterChange}
                      />
                      <span>Remote (120)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="jobType" 
                        value="hybrid" 
                        checked={searchFilters.jobType === 'hybrid'}
                        onChange={handleFilterChange}
                      />
                      <span>Hybrid (85)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="jobType" 
                        value="onsite" 
                        checked={searchFilters.jobType === 'onsite'}
                        onChange={handleFilterChange}
                      />
                      <span>On-site (240)</span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Experience Filter */}
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilterSection('experience')}
                >
                  <h4>Experience</h4>
                  <span>{expandedFilters.experience ? <FaChevronDown /> : <FaChevronRight />}</span>
                </div>
                {expandedFilters.experience && (
                  <div className="filter-options">
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="experienceMin" 
                        value="0" 
                        checked={searchFilters.experienceMin === '0'}
                        onChange={handleFilterChange}
                      />
                      <span>Fresher (0-1 yrs) (45)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="experienceMin" 
                        value="2" 
                        checked={searchFilters.experienceMin === '2'}
                        onChange={handleFilterChange}
                      />
                      <span>2-5 yrs (120)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="experienceMin" 
                        value="5" 
                        checked={searchFilters.experienceMin === '5'}
                        onChange={handleFilterChange}
                      />
                      <span>5-10 yrs (95)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="experienceMin" 
                        value="10" 
                        checked={searchFilters.experienceMin === '10'}
                        onChange={handleFilterChange}
                      />
                      <span>10+ yrs (60)</span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Department Filter */}
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilterSection('department')}
                >
                  <h4>Department</h4>
                  <span>{expandedFilters.department ? <FaChevronDown /> : <FaChevronRight />}</span>
                </div>
                {expandedFilters.department && (
                  <div className="filter-options">
                    <label className="filter-option">
                      <input type="checkbox" />
                      <span>Engineering (180)</span>
                    </label>
                    <label className="filter-option">
                      <input type="checkbox" />
                      <span>Sales (95)</span>
                    </label>
                    <label className="filter-option">
                      <input type="checkbox" />
                      <span>Marketing (75)</span>
                    </label>
                    <label className="filter-option">
                      <input type="checkbox" />
                      <span>Finance (45)</span>
                    </label>
                    <label className="filter-option">
                      <input type="checkbox" />
                      <span>HR (30)</span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Salary Filter */}
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilterSection('salary')}
                >
                  <h4>Salary</h4>
                  <span>{expandedFilters.salary ? <FaChevronDown /> : <FaChevronRight />}</span>
                </div>
                {expandedFilters.salary && (
                  <div className="filter-options">
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="minSalary" 
                        value="0" 
                        checked={searchFilters.minSalary === '0'}
                        onChange={handleFilterChange}
                      />
                      <span>0 - 3 Lakhs (75)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="minSalary" 
                        value="300000" 
                        checked={searchFilters.minSalary === '300000'}
                        onChange={handleFilterChange}
                      />
                      <span>3 - 6 Lakhs (120)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="minSalary" 
                        value="600000" 
                        checked={searchFilters.minSalary === '600000'}
                        onChange={handleFilterChange}
                      />
                      <span>6 - 10 Lakhs (95)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="minSalary" 
                        value="1000000" 
                        checked={searchFilters.minSalary === '1000000'}
                        onChange={handleFilterChange}
                      />
                      <span>10+ Lakhs (60)</span>
                    </label>
                  </div>
                )}
              </div>
              
              {/* Location Filter */}
              <div className="filter-group">
                <div 
                  className="filter-group-header" 
                  onClick={() => toggleFilterSection('location')}
                >
                  <h4>Location</h4>
                  <span>{expandedFilters.location ? <FaChevronDown /> : <FaChevronRight />}</span>
                </div>
                {expandedFilters.location && (
                  <div className="filter-options">
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="location" 
                        value="Bangalore" 
                        checked={searchFilters.location === 'Bangalore'}
                        onChange={handleFilterChange}
                      />
                      <span>Bangalore (120)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="location" 
                        value="Mumbai" 
                        checked={searchFilters.location === 'Mumbai'}
                        onChange={handleFilterChange}
                      />
                      <span>Mumbai (95)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="location" 
                        value="Delhi" 
                        checked={searchFilters.location === 'Delhi'}
                        onChange={handleFilterChange}
                      />
                      <span>Delhi (85)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="location" 
                        value="Hyderabad" 
                        checked={searchFilters.location === 'Hyderabad'}
                        onChange={handleFilterChange}
                      />
                      <span>Hyderabad (75)</span>
                    </label>
                    <label className="filter-option">
                      <input 
                        type="checkbox" 
                        name="location" 
                        value="Chennai" 
                        checked={searchFilters.location === 'Chennai'}
                        onChange={handleFilterChange}
                      />
                      <span>Chennai (60)</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="jobs-main">
          {/* Header with Search and Controls */}
          <div className="jobs-header">
            <div className="header-content">
              <h1>{user?.role === 'employer' ? 'My Job Postings' : 'Available Jobs'}</h1>
              <div className="header-controls">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or skills..."
                    value={searchFilters.search}
                    onChange={handleFilterChange}
                    name="search"
                    className="search-input"
                  />
                  <button className="search-btn">
                    <FaSearch />
                  </button>
                </div>
                
                <div className="header-actions">
                  <select 
                    value={sortBy} 
                    onChange={handleSortChange}
                    className="sort-dropdown"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="newest">Sort by: Newest</option>
                    <option value="salary-high">Sort by: Salary high-to-low</option>
                  </select>
                  
                  {user?.role === 'employer' && (
                    <Link href="/post-job" className="btn btn-primary">
                      <FaPlus /> Post Job
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Jobs List */}
          <div className="jobs-list">
            {jobs.length === 0 ? (
              <div className="no-jobs">
                <p>No jobs found matching your criteria.</p>
                {user?.role === 'employer' && (
                  <Link href="/post-job" className="btn btn-primary">
                    <FaPlus /> Post Your First Job
                  </Link>
                )}
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id || job._id} className="naukri-job-card">
                  <div className="job-card-content">
                    <div className="job-company-logo">
                      <div className="logo-placeholder">
                        <FaBriefcase />
                      </div>
                    </div>
                    
                    <div className="job-details">
                      <div className="job-header-info">
                        <h3 className="job-title">{job.title || 'Untitled Position'}</h3>
                        <button className="save-job-btn">
                          <FaHeart />
                        </button>
                      </div>
                      
                      <div className="company-info">
                        <span className="company-name">{job.company || 'Not specified'}</span>
                        <span className="company-rating">
                          <FaStar /> 4.2 | 1.2k reviews
                        </span>
                      </div>
                      
                      <div className="job-meta">
                        <span className="experience-badge">
                          {job.experience_required || 'Not specified'} Yrs
                        </span>
                        <span className="salary-range">
                          <FaRupeeSign /> 
                          {job.salary ? (
                            `${job.salary.toLocaleString()}`
                          ) : job.salary_min ? (
                            `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                          ) : (
                            'Not disclosed'
                          )}
                        </span>
                        <span className="job-location">
                          <FaMapMarkerAlt /> {job.location || 'Not specified'}
                        </span>
                      </div>
                      
                      <div className="job-posted">
                        Posted 5 days ago
                      </div>
                      
                      <div className="job-skills">
                        {(job.skills || ['JavaScript', 'React', 'Node.js']).slice(0, 5).map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                      
                      <div className="job-description">
                        {job.description ? job.description.substring(0, 150) + '...' : 'No description provided'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="job-card-actions">
                    <Link href={`/jobs/${job.id || job._id}`} className="btn btn-outline">
                      <FaEye /> View Details
                    </Link>
                    
                    {user?.role === 'job_seeker' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          if (!user) {
                            alert('Please log in to apply for jobs');
                            return;
                          }
                          router.push(`/jobs/${job.id || job._id}`);
                        }}
                      >
                        Apply
                      </button>
                    )}
                    
                    {user?.role === 'employer' && (
                      <>
                        <Link href={`/jobs/${job.id || job._id}/edit`} className="btn btn-outline">
                          <FaEdit /> Edit
                        </Link>
                        <button 
                          className="btn btn-danger"
                          onClick={() => deleteJob(job.id || job._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {jobs.length > 0 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i + 1}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                className="pagination-btn" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .jobs-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 20px 5%;
          min-height: calc(100vh - 200px);
        }

        .layout-container {
          display: flex;
          gap: 20px;
        }

        /* Filter Sidebar */
        .filter-sidebar {
          width: 280px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .filter-section {
          padding: 20px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .filter-header h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }

        .clear-filters-btn {
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .filter-group {
          margin-bottom: 15px;
        }

        .filter-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
        }

        .filter-group-header h4 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .filter-group-header span {
          color: #666;
        }

        .filter-options {
          padding: 10px 0;
        }

        .filter-option {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .filter-option input {
          margin-right: 10px;
        }

        .filter-option span {
          color: #666;
          font-size: 0.9rem;
        }

        /* Main Content */
        .jobs-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .jobs-header {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .header-content h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #333;
        }

        .header-controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .search-bar {
          position: relative;
          width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .search-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .sort-dropdown {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          color: #333;
          font-size: 0.9rem;
        }

        /* Job Cards */
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .naukri-job-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .naukri-job-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .job-card-content {
          display: flex;
          gap: 20px;
        }

        .job-company-logo {
          flex-shrink: 0;
        }

        .logo-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
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
          font-size: 1.2rem;
          color: #333;
          font-weight: 600;
        }

        .save-job-btn {
          background: none;
          border: none;
          color: #ccc;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .save-job-btn:hover {
          color: #e00;
          background: #ffe6e6;
        }

        .company-info {
          display: flex;
          gap: 15px;
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

        .job-posted {
          color: #888;
          font-size: 0.8rem;
          margin-bottom: 10px;
        }

        .job-skills {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .skill-tag {
          background: #f0f0f0;
          color: #666;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .job-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .job-card-actions {
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

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn:hover {
          opacity: 0.9;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-top: 20px;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          cursor: pointer;
          border-radius: 4px;
        }

        .pagination-btn.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading and Error States */
        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .loading-placeholder, .error-placeholder {
          padding: 20px;
          text-align: center;
          color: #666;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .error-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
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

        .no-jobs {
          text-align: center;
          padding: 50px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .no-jobs p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 20px;
        }

        @media (max-width: 992px) {
          .layout-container {
            flex-direction: column;
          }
          
          .filter-sidebar {
            width: 100%;
          }
          
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-controls {
            width: 100%;
            justify-content: space-between;
          }
          
          .job-card-content {
            flex-direction: column;
          }
          
          .job-card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}