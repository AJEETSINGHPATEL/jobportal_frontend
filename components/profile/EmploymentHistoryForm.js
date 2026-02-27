import { useState } from 'react';

export default function EmploymentHistoryForm({ onSave, initialData = [] }) {
    const [history, setHistory] = useState(initialData);
    const [isAdding, setIsAdding] = useState(false);
    const [newRole, setNewRole] = useState({
        company: '',
        designation: '',
        start_date: '',
        end_date: '',
        is_current: false,
        salary: '',
        description: '',
        notice_period: ''
    });

    const handleAdd = () => {
        setHistory([...history, newRole]);
        setIsAdding(false);
        onSave([...history, newRole]);
        setNewRole({
            company: '',
            designation: '',
            start_date: '',
            end_date: '',
            is_current: false,
            salary: '',
            description: '',
            notice_period: ''
        });
    };

    const handleRemove = (index) => {
        const updatedHistory = history.filter((_, i) => i !== index);
        setHistory(updatedHistory);
        onSave(updatedHistory);
    };

    const handleInputChange = (index, field, value) => {
        const updatedHistory = [...history];
        updatedHistory[index][field] = value;
        setHistory(updatedHistory);
        onSave(updatedHistory);
    };

    return (
        <div className="form-section">
            <div className="section-header">
                <h2 className="employment-history-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Employment History
                </h2>
            </div>
            
            <div className="employment-history-list">
                {history.map((record, idx) => (
                    <div key={idx} className="employment-item">
                        <div className="employment-header">
                            <div className="employment-position">
                                <h4 className="employment-designation">{record.designation}</h4>
                                <p className="employment-company">{record.company}</p>
                            </div>
                            <button 
                                onClick={() => handleRemove(idx)}
                                className="remove-btn"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="employment-details">
                            <div className="employment-dates">
                                <span className="employment-date">{record.start_date} - {record.is_current ? 'Present' : record.end_date}</span>
                                {record.salary && <span className="employment-salary">• {record.salary}</span>}
                                {record.notice_period && <span className="employment-notice">• {record.notice_period} notice</span>}
                            </div>
                            {record.description && <p className="employment-description">{record.description}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="add-employment-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Company *</label>
                            <input
                                placeholder="Company Name"
                                className="form-input"
                                value={newRole.company}
                                onChange={e => setNewRole({ ...newRole, company: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Designation *</label>
                            <input
                                placeholder="Job Title"
                                className="form-input"
                                value={newRole.designation}
                                onChange={e => setNewRole({ ...newRole, designation: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={newRole.start_date}
                                onChange={e => setNewRole({ ...newRole, start_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            {!newRole.is_current && (
                                <>
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={newRole.end_date}
                                        onChange={e => setNewRole({ ...newRole, end_date: e.target.value })}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Salary</label>
                            <input
                                placeholder="e.g. 10 LPA"
                                className="form-input"
                                value={newRole.salary}
                                onChange={e => setNewRole({ ...newRole, salary: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notice Period</label>
                            <input
                                placeholder="e.g. 30 days"
                                className="form-input"
                                value={newRole.notice_period}
                                onChange={e => setNewRole({ ...newRole, notice_period: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Job Description</label>
                        <textarea
                            placeholder="Describe your role and responsibilities..."
                            className="form-input"
                            rows="4"
                            value={newRole.description}
                            onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={newRole.is_current}
                                onChange={e => setNewRole({ ...newRole, is_current: e.target.checked })}
                            />
                            <span>I currently work here</span>
                        </label>
                    </div>
                    
                    <div className="form-actions">
                        <button onClick={handleAdd} className="btn btn-primary">Save Employment</button>
                        <button onClick={() => setIsAdding(false)} className="btn btn-outline">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="form-actions">
                    <button onClick={() => setIsAdding(true)} className="add-btn">
                        + Add Employment
                    </button>
                </div>
            )}
        </div>
    );
}