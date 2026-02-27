import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

export default function ApplyJob({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    resume_id: '',
    status: 'applied'
  });
  const [resumes, setResumes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (id && user) {
      fetchJobDetails();
      fetchUserResumes();
    }
  }, [id, user]);

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

  const fetchUserResumes = async () => {
    try {
      const response = await api.getUserResumes(user.id);
      setResumes(response);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields before submission
      console.log('Job ID from router:', id);
      console.log('Type of Job ID:', typeof id);
      console.log('Job ID Array?', Array.isArray(id));
      console.log('User data:', user);
      console.log('Application data:', applicationData);
      console.log('Resumes available:', resumes);
      
      // Handle case where id might be an array (from Next.js dynamic routes)
      let jobId = id;
      if (Array.isArray(id)) {
        jobId = id[0];
      } else if (typeof id === 'object' && id !== null) {
        jobId = id.toString();
      }
      
      if (!jobId) {
        throw new Error('Job ID is missing. Cannot submit application.');
      }
      
      if (!applicationData.cover_letter.trim()) {
        throw new Error('Cover letter is required.');
      }
      
      // Get the resume URL from the selected resume
      const selectedResume = resumes.find(resume => resume.id === applicationData.resume_id);
      console.log('Selected resume ID:', applicationData.resume_id);
      console.log('Found selected resume:', selectedResume);
      
      const resume_url = selectedResume ? selectedResume.resume_url || selectedResume.file_url || selectedResume.url || selectedResume.file_path : null;
      console.log('Extracted resume_url:', resume_url);
      
      const applicationPayload = {
        job_id: String(jobId),
        cover_letter: applicationData.cover_letter,
        resume_url: resume_url || null  // Include resume_url in the payload, even if null
      };
      
      // Only include status if it's not the default value
      if (applicationData.status && applicationData.status !== 'applied') {
        applicationPayload.status = applicationData.status;
      }
      
      console.log('Final application payload:', applicationPayload);
      
      console.log('Final application payload:', applicationPayload);

      console.log('Submitting application with payload:', applicationPayload);
      await api.applyForJob(applicationPayload);
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/applications');
      }, 2000);
    } catch (err) {
      console.error('Error applying for job:', err);
      console.error('Error status:', err.status);
      console.error('Error response:', err.response);
      
      let errorMessage = err.message || 'Failed to submit application';
      
      if (err.status === 401) {
        errorMessage = 'Authentication failed. Please log in again. Session may have expired.';
        // Clear any invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        router.push('/login');
      } else if (err.status === 400) {
        errorMessage = 'Bad request. Please check your application data.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Use the API client instead of direct fetch to ensure proper handling
      const result = await api.uploadResume(file, user.id);
      
      // Add the new resume to the list
      setResumes(prev => [...prev, result]);
      
      // Automatically select the newly uploaded resume
      setApplicationData(prev => ({
        ...prev,
        resume_id: result.id
      }));
      
      // Reset file input
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading resume:', err);
      // Provide a more user-friendly error message
      if (err.message.includes('Failed to fetch')) {
        setUploadError('Unable to connect to the server. Please check if the backend is running on port 8002.');
      } else {
        setUploadError(err.message || 'Failed to upload resume');
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="apply-job-container">
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading job details...</p>
      </div>
    </div>
  );

  if (error && !loading) return (
    <div className="apply-job-container">
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

  if (success) return (
    <div className="apply-job-container">
      <div className="success-state">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        <h3>Application Submitted Successfully!</h3>
        <p>Your application has been sent to the employer.</p>
        <p>Redirecting to your applications...</p>
      </div>
    </div>
  );

  if (!job) return (
    <div className="apply-job-container">
      <div className="error-message">
        <h3>Job Not Found</h3>
        <p>The job you're looking to apply for doesn't exist or has been removed.</p>
        <Link href="/jobs" className="btn btn-primary">
          <FaArrowLeft /> Back to Jobs
        </Link>
      </div>
    </div>
  );

  return (
    <div className="apply-job-container">
      <div className="apply-header">
        <button 
          className="back-button"
          onClick={() => router.push(`/jobs/${id}`)}
        >
          <FaArrowLeft /> Back to Job
        </button>
        
        <div className="job-title-section">
          <h1>Apply for {job.title || 'Untitled Position'}</h1>
          <p>{job.company || 'Company not specified'}</p>
        </div>
      </div>

      <div className="apply-content">
        <div className="job-summary">
          <h2>Job Summary</h2>
          <div className="summary-details">
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> 
              {job.salary && (job.salary.min || job.salary.max) ? 
               `$${job.salary.min?.toLocaleString() || '0'} - $${job.salary.max?.toLocaleString() || '0'}` : 
               'Not specified'}
            </p>
            <p><strong>Job Type:</strong> {job.jobType ? job.jobType.replace('_', ' ').toUpperCase() : 'Not specified'}</p>
          </div>
        </div>

        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Select Resume</h3>
            <div className="form-group">
              <label htmlFor="resume_id">Choose a resume to submit:</label>
              <select
                id="resume_id"
                name="resume_id"
                value={applicationData.resume_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a resume</option>
                {resumes.map(resume => (
                  <option key={resume.id} value={resume.id}>
                    {resume.file_name} - Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {!resumes.length && (
                <p className="no-resumes">
                  You don't have any resumes uploaded.
                </p>
              )}
              {/* Inline resume upload section */}
              <div className="resume-upload-section">
                <label htmlFor="resume-upload">Or upload a new resume:</label>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="resume-upload-input"
                />
                {uploading && (
                  <div className="upload-status">
                    <span className="loading-spinner-small"></span>
                    Uploading...
                  </div>
                )}
                {uploadError && (
                  <div className="error-message-small">
                    {uploadError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Cover Letter</h3>
            <div className="form-group">
              <label htmlFor="cover_letter">Write a cover letter:</label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                value={applicationData.cover_letter}
                onChange={handleChange}
                rows="6"
                placeholder="Explain why you're a good fit for this position..."
                required
              ></textarea>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || !applicationData.resume_id}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <Link href={`/jobs/${id}`} className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .apply-job-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .apply-header {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
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

        .apply-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
        }

        .job-summary {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .job-summary h2 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .summary-details p {
          margin: 0;
          color: #555;
        }

        .summary-details strong {
          color: #333;
        }

        .application-form {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 25px;
        }

        .form-section h3 {
          margin: 0 0 16px 0;
          color: #333;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input[type="file"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .upload-status {
          margin-top: 10px;
          color: #0070f3;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading-spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message-small {
          color: #c33;
          font-size: 0.9rem;
          margin-top: 8px;
        }

        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }

        .no-resumes {
          color: #666;
          font-size: 0.9rem;
          margin-top: 8px;
        }

        .no-resumes a {
          color: #0070f3;
          text-decoration: none;
        }

        .no-resumes a:hover {
          text-decoration: underline;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          border: 1px solid #fcc;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0060d0;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-outline {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }

        .btn-outline:hover {
          background: #f0f7ff;
        }

        .loading-state, .error-state, .success-state {
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

        .error-icon, .success-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .success-icon {
          color: #28a745;
        }

        .error-state h3, .success-state h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .error-state p, .success-state p {
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

        .resume-upload-section {
          margin-top: 15px;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          background-color: #f9f9f9;
        }

        .resume-upload-input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .upload-status {
          margin-top: 10px;
          color: #0070f3;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading-spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message-small {
          color: #c33;
          font-size: 0.9rem;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .apply-job-container {
            padding: 10px;
          }

          .apply-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
