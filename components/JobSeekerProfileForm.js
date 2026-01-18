import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function JobSeekerProfileForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    phone: '',
    skills: [],
    experience_years: '',
    education: [{ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', grade: '' }],
    preferred_locations: [],
    resume_url: '',
    profile_completion_pct: 0
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || '',
        skills: profile.skills || [],
        experience_years: profile.experience_years || '',
        education: profile.education && profile.education.length > 0 
          ? profile.education 
          : [{ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', grade: '' }],
        preferred_locations: profile.preferred_locations || [],
        resume_url: profile.resume_url || '',
        profile_completion_pct: profile.profile_completion_pct || 0
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', grade: '' }]
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      const newEducation = [...formData.education];
      newEducation.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        education: newEducation
      }));
    }
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

  const addLocation = () => {
    if (locationInput.trim() && !formData.preferred_locations.includes(locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferred_locations: [...prev.preferred_locations, locationInput.trim()]
      }));
      setLocationInput('');
    }
  };

  const removeLocation = (locationToRemove) => {
    setFormData(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.filter(location => location !== locationToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-section">
        <h3>Contact Information</h3>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Skills</h3>
        <div className="skills-input">
          <div className="form-group">
            <label>Add Skill</label>
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
        <h3>Experience</h3>
        <div className="form-group">
          <label htmlFor="experience_years">Years of Experience</label>
          <input
            type="number"
            id="experience_years"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <h4>Education #{index + 1}</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Field of Study</label>
                <input
                  type="text"
                  value={edu.field_of_study}
                  onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Grade</label>
                <input
                  type="text"
                  value={edu.grade}
                  onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={edu.start_date}
                  onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={edu.end_date}
                  onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            
            {formData.education.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeEducation(index)}
              >
                Remove Education
              </button>
            )}
          </div>
        ))}
        
        <button type="button" className="btn-add" onClick={addEducation}>
          Add Another Education
        </button>
      </div>

      <div className="form-section">
        <h3>Preferred Locations</h3>
        <div className="locations-input">
          <div className="form-group">
            <label>Add Preferred Location</label>
            <div className="input-group">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter a location"
                className="form-input"
              />
              <button type="button" onClick={addLocation} className="btn-add">
                Add
              </button>
            </div>
          </div>
          
          <div className="location-tags">
            {formData.preferred_locations.map((location, index) => (
              <div key={index} className="location-tag">
                {location}
                <button
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => removeLocation(location)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Resume</h3>
        <div className="form-group">
          <label htmlFor="resume_url">Resume URL</label>
          <input
            type="url"
            id="resume_url"
            name="resume_url"
            value={formData.resume_url}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/resume.pdf"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save Profile
        </button>
      </div>

      <style jsx>{`
        .profile-form {
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
        
        .btn-add, .btn-remove {
          padding: 10px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        
        .btn-add {
          background: #0070f3;
          color: white;
        }
        
        .btn-remove {
          background: #dc3545;
          color: white;
          margin-top: 10px;
        }
        
        .skills-input, .locations-input {
          margin-top: 20px;
        }
        
        .skills-tags, .location-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        
        .skill-tag, .location-tag {
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
        
        .education-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .education-item h4 {
          margin: 0 0 15px 0;
          color: #333;
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