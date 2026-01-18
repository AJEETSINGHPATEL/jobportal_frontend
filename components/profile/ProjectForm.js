import { useState } from 'react';

export default function ProjectForm({ onSave, initialData = [] }) {
    const [projects, setProjects] = useState(initialData);
    const [isAdding, setIsAdding] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        role: '',
        url: '',
        start_date: '',
        end_date: ''
    });

    const handleAdd = () => {
        setProjects([...projects, newProject]);
        setIsAdding(false);
        onSave([...projects, newProject]);
        setNewProject({
            title: '',
            description: '',
            role: '',
            url: '',
            start_date: '',
            end_date: ''
        });
    };

    const handleRemove = (index) => {
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
        onSave(updatedProjects);
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <h2 className="project-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Projects
                </h2>
            </div>
            
            <div className="project-list">
                {projects.map((proj, idx) => (
                    <div key={idx} className="project-item">
                        <div className="project-header">
                            <div className="project-info">
                                <h4 className="project-title-name">{proj.title}</h4>
                                <p className="project-role">{proj.role}</p>
                                {proj.url && (
                                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="project-link">
                                        View Project
                                    </a>
                                )}
                            </div>
                            <button 
                                onClick={() => handleRemove(idx)}
                                className="remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="project-details">
                            <div className="project-dates">
                                <span className="project-date">{proj.start_date} - {proj.end_date}</span>
                            </div>
                            <p className="project-description">{proj.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="add-project-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Project Title *</label>
                            <input
                                placeholder="Enter project title"
                                className="form-input"
                                value={newProject.title}
                                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Your Role *</label>
                            <input
                                placeholder="e.g. Lead Developer, Team Member"
                                className="form-input"
                                value={newProject.role}
                                onChange={e => setNewProject({ ...newProject, role: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Project URL</label>
                        <input
                            placeholder="https://example.com"
                            className="form-input"
                            value={newProject.url}
                            onChange={e => setNewProject({ ...newProject, url: e.target.value })}
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={newProject.start_date}
                                onChange={e => setNewProject({ ...newProject, start_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={newProject.end_date}
                                onChange={e => setNewProject({ ...newProject, end_date: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Project Description *</label>
                        <textarea
                            placeholder="Describe the project, technologies used, and your contributions..."
                            className="form-input"
                            rows="4"
                            value={newProject.description}
                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button onClick={handleAdd} className="btn btn-primary">Save Project</button>
                        <button onClick={() => setIsAdding(false)} className="btn btn-outline">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="form-actions">
                    <button onClick={() => setIsAdding(true)} className="add-btn">
                        + Add Project
                    </button>
                </div>
            )}
        </div>
    );
}