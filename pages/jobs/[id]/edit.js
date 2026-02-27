import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

export default function EditJobPage() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    location_type: 'On-site',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: [''],
    benefits: ['']
  });

  // Mock job data
  const mockJob = {
    id: id || '1',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc',
    location: 'San Francisco, CA',
    job_type: 'Full-time',
    location_type: 'Remote',
    salary_min: 120000,
    salary_max: 150000,
    description: `We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing and maintaining our core products, mentoring junior developers, and contributing to architectural decisions.

Key Responsibilities:
- Design, develop, and maintain scalable web applications
- Collaborate with cross-functional teams to define, design, and ship new features
- Mentor junior developers and conduct code reviews
- Participate in architectural discussions and decision-making
- Write clean, maintainable, and testable code
- Stay up-to-date with emerging trends and technologies`,
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '5+ years of experience in software development',
      'Proficiency in JavaScript, React, and Node.js'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Unlimited PTO'
    ]
  };

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        setJob(mockJob);
        setFormData({
          title: mockJob.title,
          company: mockJob.company,
          location: mockJob.location,
          job_type: mockJob.job_type,
          location_type: mockJob.location_type,
          salary_min: mockJob.salary_min,
          salary_max: mockJob.salary_max,
          description: mockJob.description,
          requirements: [...mockJob.requirements],
          benefits: [...mockJob.benefits]
        });
        setLoading(false);
      }, 500);
    }
  }, [id]);

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

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would call the API to update the job
    alert('Job updated successfully!');
    router.push(`/jobs/${id}`);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      router.push(`/jobs/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="edit-job-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-job-container">
      {/* Header */}
      <div className="edit-header">
        <div className="header-content">
          <Link href={`/jobs/${id}`} className="back-link">
            <FaArrowLeft /> Back to Job
          </Link>
          <h1>Edit Job Posting</h1>
        </div>
      </div>

      {/* Edit Form */}
      <div className="edit-form-container">
        <form onSubmit={handleSubmit} className="edit-form">
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
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
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
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="location_type">Location Type</label>
                <select
                  id="location_type"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salary_min">Minimum Salary ($)</label>
                <input
                  type="number"
                  id="salary_min"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salary_max">Maximum Salary ($)</label>
                <input
                  type="number"
                  id="salary_max"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Job Description</h2>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Requirements</h2>
            
            {formData.requirements.map((req, index) => (
              <div key={index} className="form-array-item">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                  placeholder={`Requirement ${index + 1}`}
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeArrayItem(index, 'requirements')}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              className="add-btn"
              onClick={() => addArrayItem('requirements')}
            >
              + Add Requirement
            </button>
          </div>
          
          <div className="form-section">
            <h2>Benefits</h2>
            
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="form-array-item">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'benefits')}
                  placeholder={`Benefit ${index + 1}`}
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeArrayItem(index, 'benefits')}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              className="add-btn"
              onClick={() => addArrayItem('benefits')}
            >
              + Add Benefit
            </button>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSave /> Save Changes
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-job-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }

        .edit-header {
          background: white;
          border-radius: 12px;
          padding: 1rem 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-content h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #333;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0070f3;
          text-decoration: none;
          font-weight: 500;
        }

        .edit-form-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .edit-form {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #eee;
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .form-section h2 {
          margin: 0 0 20px 0;
          font-size: 1.5rem;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-array-item {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .form-array-item input {
          flex: 1;
        }

        .remove-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: #f8f9fa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-btn {
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px dashed #0070f3;
          background: transparent;
          color: #0070f3;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #eee;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
          font-size: 1rem;
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .form-array-item {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}