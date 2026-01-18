import { useState } from 'react';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [
      {
        id: 1,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
      }
    ],
    skills: [''],
    template: 'template_1'
  });

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const removeExperience = (id) => {
    if (resumeData.experience.length > 1) {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id)
      }));
    }
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: ''
        }
      ]
    }));
  };

  const removeEducation = (id) => {
    if (resumeData.education.length > 1) {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
      }));
    }
  };

  const updateSkill = (index, value) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = value;
    setResumeData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    if (resumeData.skills.length > 1) {
      const newSkills = [...resumeData.skills];
      newSkills.splice(index, 1);
      setResumeData(prev => ({
        ...prev,
        skills: newSkills
      }));
    }
  };

  const handleSave = () => {
    // In a real app, you would save this to your backend
    console.log('Resume saved:', resumeData);
    alert('Resume saved successfully!');
  };

  const handleExport = (format) => {
    // In a real app, you would export in the specified format
    console.log(`Exporting resume as ${format}`);
    alert(`Resume exported as ${format}!`);
  };

  return (
    <div className="container">
      <h1>AI Resume Builder</h1>
      
      <div className="builder-container">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={resumeData.personalInfo.address}
              onChange={(e) => updatePersonalInfo('address', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>LinkedIn:</label>
            <input
              type="text"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>GitHub:</label>
            <input
              type="text"
              value={resumeData.personalInfo.github}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Professional Summary:</label>
            <textarea
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              rows="4"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Work Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Company:</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Position:</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date:</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date:</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  rows="3"
                />
              </div>
              
              <button 
                type="button" 
                onClick={() => removeExperience(exp.id)}
                className="remove-btn"
              >
                Remove Experience
              </button>
            </div>
          ))}
          
          <button type="button" onClick={addExperience} className="add-btn">
            Add Experience
          </button>
        </div>
        
        <div className="form-section">
          <h2>Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="education-item">
              <div className="form-row">
                <div className="form-group">
                  <label>Institution:</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Degree:</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Field of Study:</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Years:</label>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Start"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="End"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => removeEducation(edu.id)}
                className="remove-btn"
              >
                Remove Education
              </button>
            </div>
          ))}
          
          <button type="button" onClick={addEducation} className="add-btn">
            Add Education
          </button>
        </div>
        
        <div className="form-section">
          <h2>Skills</h2>
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <div className="form-row">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Skill"
                />
                <button 
                  type="button" 
                  onClick={() => removeSkill(index)}
                  className="remove-skill-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <button type="button" onClick={addSkill} className="add-btn">
            Add Skill
          </button>
        </div>
        
        <div className="form-section">
          <h2>Template Selection</h2>
          <div className="template-selector">
            <select
              value={resumeData.template}
              onChange={(e) => setResumeData(prev => ({ ...prev, template: e.target.value }))}
            >
              <option value="template_1">Professional Template 1</option>
              <option value="template_2">Modern Template 2</option>
              <option value="template_3">Creative Template 3</option>
            </select>
          </div>
        </div>
        
        <div className="actions">
          <button onClick={handleSave}>Save Resume</button>
          <button onClick={() => handleExport('pdf')}>Export as PDF</button>
          <button onClick={() => handleExport('docx')}>Export as DOCX</button>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .builder-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .form-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-section h2 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 3px;
        }
        
        .experience-item, .education-item {
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .skill-item {
          margin-bottom: 0.5rem;
        }
        
        .remove-btn, .remove-skill-btn {
          background: #ff4d4d;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        
        .add-btn {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 3px;
          cursor: pointer;
          margin-top: 1rem;
        }
        
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .actions button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}