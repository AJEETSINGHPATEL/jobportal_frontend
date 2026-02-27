import { useState, useEffect } from 'react';

export default function RecruiterProfileForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    company_name: '',
    company_logo: '',
    designation: '',
    company_website: '',
    industry: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        company_logo: profile.company_logo || '',
        designation: profile.designation || '',
        company_website: profile.company_website || '',
        industry: profile.industry || ''
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
        <h3>Company Information</h3>
        
        <div className="form-group">
          <label htmlFor="company_name">Company Name *</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company_logo">Company Logo URL</label>
          <input
            type="url"
            id="company_logo"
            name="company_logo"
            value={formData.company_logo}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company_website">Company Website</label>
          <input
            type="url"
            id="company_website"
            name="company_website"
            value={formData.company_website}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Personal Information</h3>
        
        <div className="form-group">
          <label htmlFor="designation">Your Designation *</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Industry</h3>
        
        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Media">Media</option>
            <option value="Telecommunications">Telecommunications</option>
            <option value="Transportation">Transportation</option>
            <option value="Energy">Energy</option>
            <option value="Government">Government</option>
            <option value="Non-profit">Non-profit</option>
            <option value="Other">Other</option>
          </select>
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
      `}</style>
    </form>
  );
}