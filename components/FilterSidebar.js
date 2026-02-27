import { useState } from 'react';

export default function FilterSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    experience: '',
    jobType: '',
    workMode: '',
    salary: ''
  });

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-sidebar">
      <h3>Filter Results</h3>
      
      <div className="filter-group">
        <h4>Experience</h4>
        <select 
          value={filters.experience} 
          onChange={(e) => handleFilterChange('experience', e.target.value)}
          className="filter-select"
        >
          <option value="">Select Experience</option>
          <option value="0">Fresher</option>
          <option value="1">1 Year</option>
          <option value="2">2 Years</option>
          <option value="3">3 Years</option>
          <option value="4">4 Years</option>
          <option value="5">5+ Years</option>
        </select>
      </div>
      
      <div className="filter-group">
        <h4>Job Type</h4>
        <select 
          value={filters.jobType} 
          onChange={(e) => handleFilterChange('jobType', e.target.value)}
          className="filter-select"
        >
          <option value="">Select Job Type</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>
      
      <div className="filter-group">
        <h4>Work Mode</h4>
        <select 
          value={filters.workMode} 
          onChange={(e) => handleFilterChange('workMode', e.target.value)}
          className="filter-select"
        >
          <option value="">Select Work Mode</option>
          <option value="onsite">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
      
      <div className="filter-group">
        <h4>Salary</h4>
        <select 
          value={filters.salary} 
          onChange={(e) => handleFilterChange('salary', e.target.value)}
          className="filter-select"
        >
          <option value="">Select Salary Range</option>
          <option value="0-3">0-3 Lakhs</option>
          <option value="3-6">3-6 Lakhs</option>
          <option value="6-10">6-10 Lakhs</option>
          <option value="10-15">10-15 Lakhs</option>
          <option value="15+">15+ Lakhs</option>
        </select>
      </div>
      
      <button 
        className="btn-clear-filters"
        onClick={() => {
          setFilters({
            experience: '',
            jobType: '',
            workMode: '',
            salary: ''
          });
          onFilterChange({
            experience: '',
            jobType: '',
            workMode: '',
            salary: ''
          });
        }}
      >
        Clear All Filters
      </button>
      
      <style jsx>{`
        .filter-sidebar {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          height: fit-content;
        }
        
        .filter-sidebar h3 {
          margin-top: 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .filter-group {
          margin-bottom: 1.5rem;
        }
        
        .filter-group h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }
        
        .filter-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
        }
        
        .btn-clear-filters {
          width: 100%;
          padding: 0.75rem;
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}