import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    workMode: '',
    salaryMin: 0,
    experienceMin: 0,
    experienceMax: 100,
    skills: ''
  });

  useEffect(() => {
    // Load jobs when component mounts
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/jobs/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
      // Set some sample jobs for demo purposes
      setJobs([
        {
          id: '1',
          title: 'Senior Python Developer',
          company: 'Tech Innovations Inc.',
          location: 'Bangalore, India',
          salary_min: 800000,
          salary_max: 1200000,
          skills: ['Python', 'Django', 'AWS', 'Docker'],
          experience_required: '3-5 years',
          work_mode: 'Remote',
          description: 'We are looking for an experienced Python developer to join our team...',
          posted_date: new Date().toISOString(),
          is_active: true,
          application_count: 15,
          view_count: 120
        },
        {
          id: '2',
          title: 'Frontend React Developer',
          company: 'Digital Solutions Ltd.',
          location: 'Mumbai, India',
          salary_min: 600000,
          salary_max: 900000,
          skills: ['React', 'JavaScript', 'CSS', 'HTML'],
          experience_required: '2-4 years',
          work_mode: 'Hybrid',
          description: 'Join our frontend team to build amazing user experiences...',
          posted_date: new Date().toISOString(),
          is_active: true,
          application_count: 8,
          view_count: 85
        },
        {
          id: '3',
          title: 'Data Scientist',
          company: 'Analytics Pro',
          location: 'Hyderabad, India',
          salary_min: 1000000,
          salary_max: 1500000,
          skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
          experience_required: '4-7 years',
          work_mode: 'Remote',
          description: 'Looking for a data scientist to drive our analytics initiatives...',
          posted_date: new Date().toISOString(),
          is_active: true,
          application_count: 12,
          view_count: 95
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleJobClick = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Results Info */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                {loading ? 'Loading jobs...' : `Found ${jobs.length} jobs`}
              </p>
              <button 
                onClick={loadJobs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Job Listings */}
            {!loading && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={() => handleJobClick(job.id)}
                  />
                ))}
                
                {jobs.length === 0 && !loading && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter Sidebar */}
          <div className="lg:w-80">
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
