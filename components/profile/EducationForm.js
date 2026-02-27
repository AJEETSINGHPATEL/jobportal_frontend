import { useState } from 'react';

export default function EducationForm({ onSave, initialData = [] }) {
    const [education, setEducation] = useState(initialData);
    const [isAdding, setIsAdding] = useState(false);
    const [newEdu, setNewEdu] = useState({
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        grade: '',
        description: ''
    });

    const handleAdd = () => {
        setEducation([...education, newEdu]);
        setIsAdding(false);
        onSave([...education, newEdu]);
        setNewEdu({
            institution: '',
            degree: '',
            field_of_study: '',
            start_date: '',
            end_date: '',
            grade: '',
            description: ''
        });
    };

    const handleRemove = (index) => {
        const updatedEducation = education.filter((_, i) => i !== index);
        setEducation(updatedEducation);
        onSave(updatedEducation);
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <h2 className="education-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 22l-4-4 4-4"></path>
                        <path d="M10 18h9"></path>
                        <path d="M2 3h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                        <path d="M12 22s2-4 2-8"></path>
                        <path d="M8 22s2-4 2-8"></path>
                    </svg>
                    Education
                </h2>
            </div>
            
            <div className="education-list">
                {education.map((record, idx) => (
                    <div key={idx} className="education-item">
                        <div className="education-header">
                            <div className="education-degree">
                                <h4 className="education-degree-name">{record.degree} in {record.field_of_study}</h4>
                                <p className="education-institution">{record.institution}</p>
                            </div>
                            <button 
                                onClick={() => handleRemove(idx)}
                                className="remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="education-details">
                            <div className="education-dates">
                                <span className="education-date">{record.start_date} - {record.end_date}</span>
                                {record.grade && <span className="education-grade">• {record.grade}</span>}
                            </div>
                            {record.description && <p className="education-description">{record.description}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="add-education-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Institution/University *</label>
                            <input
                                placeholder="Enter institution name"
                                className="form-input"
                                value={newEdu.institution}
                                onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Degree *</label>
                            <input
                                placeholder="e.g. B.Tech, MBA"
                                className="form-input"
                                value={newEdu.degree}
                                onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Field of Study *</label>
                            <input
                                placeholder="e.g. Computer Science"
                                className="form-input"
                                value={newEdu.field_of_study}
                                onChange={e => setNewEdu({ ...newEdu, field_of_study: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Grade/CGPA</label>
                            <input
                                placeholder="e.g. 8.5 CGPA, First Class"
                                className="form-input"
                                value={newEdu.grade}
                                onChange={e => setNewEdu({ ...newEdu, grade: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={newEdu.start_date}
                                onChange={e => setNewEdu({ ...newEdu, start_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={newEdu.end_date}
                                onChange={e => setNewEdu({ ...newEdu, end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Description/Achievements</label>
                        <textarea
                            placeholder="Describe your academic achievements..."
                            className="form-input"
                            rows="4"
                            value={newEdu.description}
                            onChange={e => setNewEdu({ ...newEdu, description: e.target.value })}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button onClick={handleAdd} className="btn btn-primary">Save Education</button>
                        <button onClick={() => setIsAdding(false)} className="btn btn-outline">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="form-actions">
                    <button onClick={() => setIsAdding(true)} className="add-btn">
                        + Add Education
                    </button>
                </div>
            )}
        </div>
    );
}