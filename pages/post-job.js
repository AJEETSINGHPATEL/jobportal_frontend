import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function PostJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: [''],
    skills: [''],
    salary_min: '',
    salary_max: '',
    experience_min: '',
    experience_max: '',
    location: '',
    job_type: 'full_time',
    location_type: 'onsite'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length <= 1) return;
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Convert numeric fields to integers
      const jobData = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        experience_min: formData.experience_min ? parseInt(formData.experience_min) : null,
        experience_max: formData.experience_max ? parseInt(formData.experience_max) : null
      };
      
      // Remove empty string values from arrays
      jobData.requirements = jobData.requirements.filter(req => req.trim() !== '');
      jobData.skills = jobData.skills.filter(skill => skill.trim() !== '');
      
      // Get token from localStorage for authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Create job using API with proper authentication
      const response = await fetch(`${api.baseUrl}/api/jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to post job');
      }
      
      const result = await response.json();
      setSuccess(true);
      
      // Redirect to jobs list after 2 seconds
      setTimeout(() => {
        router.push('/employer-dashboard');
      }, 2000);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        responsibilities: '',
        requirements: [''],
        skills: [''],
        salary_min: '',
        salary_max: '',
        experience_min: '',
        experience_max: '',
        location: '',
        job_type: 'full_time',
        location_type: 'onsite'
      });
    } catch (err) {
      setError(err.message || 'Failed to post job');
      console.error('Job posting error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      {/* Header */}
      <div className="post-job-header">
        <div className="header-content">
          <Link href="/employer-dashboard" className="back-button">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1>Post a New Job</h1>
          <div></div> {/* Spacer for flex alignment */}
        </div>
      </div>

      <div className="post-job-content">
        {success && (
          <div className="alert alert-success">
            <h3>Job Posted Successfully!</h3>
            <p>Your job has been published and is now visible to job seekers.</p>
            <Link href="/employer-dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {!success && (
          <div className="form-card">
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-section">
                <h2>Basic Information</h2>
                
                <div className="form-group">
                  <label htmlFor="title">Job Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="job_type">Job Type</label>
                    <select
                      id="job_type"
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleChange}
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="internship">Internship</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location_type">Work Type</label>
                    <select
                      id="location_type"
                      name="location_type"
                      value={formData.location_type}
                      onChange={handleChange}
                    >
                      <option value="onsite">On-site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Job Description</h2>
                
                <div className="form-group">
                  <label htmlFor="description">Job Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    required
                    placeholder="Provide a detailed description of the role, responsibilities, and expectations..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="responsibilities">Key Responsibilities *</label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="List the main responsibilities for this position..."
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>Requirements & Skills</h2>
                
                <div className="form-group">
                  <label>Requirements</label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="array-field">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                        placeholder={`Requirement ${index + 1}`}
                      />
                      {formData.requirements.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeArrayField(index, 'requirements')}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addArrayField('requirements')}
                    className="add-button"
                  >
                    + Add Requirement
                  </button>
                </div>
                
                <div className="form-group">
                  <label>Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="array-field">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'skills')}
                        placeholder={`Skill ${index + 1}`}
                      />
                      {formData.skills.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeArrayField(index, 'skills')}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addArrayField('skills')}
                    className="add-button"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Compensation & Experience</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="salary_min">Min Salary (USD)</label>
                    <input
                      type="number"
                      id="salary_min"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      placeholder="e.g., 70000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="salary_max">Max Salary (USD)</label>
                    <input
                      type="number"
                      id="salary_max"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      placeholder="e.g., 120000"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experience_min">Min Experience (years)</label>
                    <input
                      type="number"
                      id="experience_min"
                      name="experience_min"
                      value={formData.experience_min}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="experience_max">Max Experience (years)</label>
                    <input
                      type="number"
                      id="experience_max"
                      name="experience_max"
                      value={formData.experience_max}
                      onChange={handleChange}
                      placeholder="e.g., 7"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary submit-button"
                >
                  <FaSave /> {loading ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .post-job-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }

        .post-job-header {
          background: linear-gradient(135deg, #0070f3 0%, #0055cc 100%);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-content h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .post-job-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .alert {
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          text-align: center;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert h3 {
          margin-top: 0;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .job-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .form-section h2 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.4rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border 0.2s ease;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
        }

        .array-field {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .array-field input {
          flex: 1;
        }

        .remove-button, .add-button {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .remove-button {
          background: #f8d7da;
          color: #721c24;
        }

        .remove-button:hover {
          background: #f5c6cb;
        }

        .add-button {
          background: #e3f2fd;
          color: #0070f3;
          width: 100%;
          text-align: center;
        }

        .add-button:hover {
          background: #bbdefb;
        }

        .form-actions {
          text-align: center;
          padding-top: 2rem;
        }

        .submit-button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #0055cc;
        }

        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          border: none;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
        }

        .btn-primary:hover {
          background: #0055cc;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 15px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .array-field {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}