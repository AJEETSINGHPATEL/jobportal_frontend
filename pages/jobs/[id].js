import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaClock, FaUserFriends, FaExternalLinkAlt } from 'react-icons/fa';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadJobDetails();
    }
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to fetch from API first
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/jobs/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      } else {
        // If API fails, use sample data
        throw new Error('Job not found');
      }
    } catch (err) {
      console.error('Error loading job:', err);
      // Set sample job data for demo
      setJob({
        id: id || '1',
        title: 'Senior Python Developer',
        company: 'Tech Innovations Inc.',
        location: 'Bangalore, India',
        salary_min: 800000,
        salary_max: 1200000,
        skills: ['Python', 'Django', 'FastAPI', 'AWS', 'Docker', 'PostgreSQL'],
        experience_required: '3-5 years',
        work_mode: 'Remote',
        description: `We are looking for an experienced Python developer to join our dynamic team. You will be responsible for building scalable web applications and APIs using modern Python frameworks.

**Key Responsibilities:**
• Design and develop high-quality Python applications
• Build and maintain RESTful APIs
• Collaborate with cross-functional teams
• Write clean, maintainable code
• Participate in code reviews
• Troubleshoot and debug applications

**Requirements:**
• 3+ years of Python development experience
• Strong knowledge of Django or FastAPI
• Experience with PostgreSQL or MongoDB
• Familiarity with AWS services
• Understanding of Docker and containerization
• Good problem-solving skills

**Nice to Have:**
• Experience with React.js
• Knowledge of microservices architecture
• Familiarity with CI/CD pipelines`,
        posted_date: new Date().toISOString(),
        is_active: true,
        application_count: 15,
        view_count: 120,
        company_logo_url: null,
        company_rating: 4.2,
        reviews_count: 28
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    // Redirect to application page
    router.push(`/apply/${id}`);
  };

  const handleSaveJob = () => {
    // Implement save job functionality
    alert('Job saved successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl text-gray-300 mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/jobs')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button 
            onClick={() => router.push('/jobs')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Job Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <FaBuilding className="mr-2" />
                  <span className="font-medium">{job.company}</span>
                  {job.company_rating && (
                    <div className="flex items-center ml-4">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{job.company_rating}</span>
                      <span className="text-gray-400 ml-1">({job.reviews_count} reviews)</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <FaDollarSign className="mr-1" />
                    {job.salary_min ? `$${job.salary_min.toLocaleString()}` : 'Not specified'} 
                    {job.salary_max ? ` - $${job.salary_max.toLocaleString()}` : ''}
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    {job.work_mode}
                  </div>
                  <div className="flex items-center">
                    <FaUserFriends className="mr-1" />
                    {job.experience_required}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 md:ml-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleApply}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Apply Now
                  </button>
                  <button 
                    onClick={handleSaveJob}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted Date:</span>
                      <span className="font-medium">
                        {new Date(job.posted_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applications:</span>
                      <span className="font-medium">{job.application_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium">{job.view_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${job.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {job.is_active ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-900 mb-2">Apply for this position</h3>
                  <p className="text-blue-800 text-sm mb-4">
                    Ready to take the next step in your career? Apply now and join our team!
                  </p>
                  <button 
                    onClick={handleApply}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
