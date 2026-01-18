import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function JobPostingForm({ job, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    salary_min: '',
    salary_max: '',
    location: '',
    skills: [],
    experience_required: '',
    work_mode: ''
  });
  
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        company: job.company || '',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        location: job.location || '',
        skills: job.skills || [],
        experience_required: job.experience_required || '',
        work_mode: job.work_mode || ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert salary fields to integers if they have values
      const jobData = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null
      };
      
      await onSave(jobData);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-section">
        <h3>Job Details</h3>
        
        <div className="form-group">
          <label htmlFor="title">Job Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Company Name *</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="form-input"
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
            className="form-input"
            placeholder="e.g., Bangalore, India"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Salary Range</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salary_min">Minimum Salary (₹)</label>
            <input
              type="number"
              id="salary_min"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="salary_max">Maximum Salary (₹)</label>
            <input
              type="number"
              id="salary_max"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Requirements</h3>
        
        <div className="form-group">
          <label htmlFor="experience_required">Experience Required</label>
          <select
            id="experience_required"
            name="experience_required"
            value={formData.experience_required}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Experience Level</option>
            <option value="Fresher">Fresher (0 years)</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="work_mode">Work Mode</label>
          <select
            id="work_mode"
            name="work_mode"
            value={formData.work_mode}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Work Mode</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
        
        <div className="skills-input">
          <div className="form-group">
            <label>Required Skills</label>
            <div className="input-group">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Enter a skill"
                className="form-input"
              />
              <button type="button" onClick={addSkill} className="btn-add">
                Add
              </button>
            </div>
          </div>
          
          <div className="skills-tags">
            {formData.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                <button
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Job Description</h3>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="8"
            className="form-input"
            placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
          ></textarea>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {job ? 'Update Job' : 'Post Job'}
        </button>
      </div>

      <style jsx>{`
        .job-form {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .form-section h3 {
          margin: 0 0 20px 0;
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
        
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .input-group {
          display: flex;
          gap: 10px;
        }
        
        .input-group .form-input {
          flex: 1;
        }
        
        .btn-add {
          padding: 10px 16px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .skills-input {
          margin-top: 20px;
        }
        
        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        
        .skill-tag {
          background: #0070f3;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .remove-tag-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .form-actions {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
        }
        
        .btn-primary {
          padding: 12px 24px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}