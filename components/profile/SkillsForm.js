import { useState } from 'react';

export default function SkillsForm({ onSave, initialData = [] }) {
    const [skills, setSkills] = useState(initialData);
    const [newSkill, setNewSkill] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            const updatedSkills = [...skills, newSkill.trim()];
            setSkills(updatedSkills);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        const updatedSkills = skills.filter(skill => skill !== skillToRemove);
        setSkills(updatedSkills);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddSkill(e);
        }
    };

    const handleSave = () => {
        onSave(skills);
        setIsEditing(false);
    };

    return (
        <div className="form-section">
            <div className="flex justify-between items-center mb-4">
                <h2 className="form-title mb-0">Skills & Expertise</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {skills.length > 0 ? (
                    skills.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                        >
                            {skill}
                            {isEditing && (
                                <button
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="w-4 h-4 rounded-full bg-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-300 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                    </svg>
                                </button>
                            )}
                        </span>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No skills added yet.</p>
                )}
            </div>

            {isEditing ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a skill (e.g. React, Python) and press Enter"
                            className="form-input flex-1"
                        />
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            disabled={!newSkill.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Press Enter to add a skill</p>
                </div>
            ) : null}

            <div className="form-actions">
                <button
                    type="button"
                    onClick={() => {
                        if (isEditing) {
                            setSkills(initialData); // Reset on cancel
                        }
                        setIsEditing(!isEditing);
                    }}
                    className="btn-secondary"
                >
                    {isEditing ? 'Cancel' : 'Edit Skills'}
                </button>

                {isEditing && (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn-primary"
                    >
                        Save Skills
                    </button>
                )}
            </div>
        </div>
    );
}
