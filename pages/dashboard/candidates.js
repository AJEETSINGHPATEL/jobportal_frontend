import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { FaSearch, FaUser, FaGraduationCap, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

export default function CandidateSearch({ user }) {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    skills: '',
    experience: '',
    location: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchFilters]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      
      // Check if user has the required role (employer) to access candidates
      if (!user || user.role !== 'employer') {
        setError('Access denied: Only employers can view candidates');
        return;
      }
      
      const response = await api.request('/profiles/candidates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCandidates(response);
      setFilteredCandidates(response);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      
      // Provide more specific error messages based on error type
      if (err.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (err.status === 403) {
        setError('Access denied: Only employers can view candidates');
      } else if (err.status === 404) {
        setError('Candidates endpoint not found. Please contact support.');
      } else if (err.message.includes('Network error')) {
        setError('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.message || 'Failed to load candidates');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterCandidates = () => {
    let filtered = [...candidates];
    
    if (searchFilters.skills) {
      const skills = searchFilters.skills.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(candidate => 
        skills.some(skill => 
          candidate.skills.some(candidateSkill => 
            candidateSkill.toLowerCase().includes(skill)
          )
        )
      );
    }
    
    if (searchFilters.experience) {
      const exp = parseInt(searchFilters.experience);
      if (!isNaN(exp)) {
        filtered = filtered.filter(candidate => 
          candidate.experience_years >= exp
        );
      }
    }
    
    if (searchFilters.location) {
      const location = searchFilters.location.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.preferred_locations.some(loc => 
          loc.toLowerCase().includes(location)
        )
      );
    }
    
    setFilteredCandidates(filtered);
  };

  const clearFilters = () => {
    setSearchFilters({
      skills: '',
      experience: '',
      location: ''
    });
  };

  if (loading) return (
    <div className="candidates-container">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading candidates...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="candidates-container">
      <div className="error-state">
        <h3>Error Loading Candidates</h3>
        <p>{error}</p>
        {/* Show retry button only for network or server errors, not permission errors */}
        {!error.includes('Access denied') && !error.includes('Session expired') && (
          <button onClick={fetchCandidates} className="btn btn-primary">Retry</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="candidates-container">
      <div className="header">
        <h1>Candidate Search</h1>
        <p>Find the perfect candidates for your job openings</p>
      </div>

      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <div className="input-with-icon">
              <FaSearch className="input-icon" />
              <input
                type="text"
                id="skills"
                name="skills"
                value={searchFilters.skills}
                onChange={handleFilterChange}
                placeholder="e.g., JavaScript, React, Node.js"
                className="filter-input"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label htmlFor="experience">Minimum Experience (years)</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={searchFilters.experience}
              onChange={handleFilterChange}
              placeholder="e.g., 3"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                id="location"
                name="location"
                value={searchFilters.location}
                onChange={handleFilterChange}
                placeholder="e.g., Bangalore"
                className="filter-input"
              />
            </div>
          </div>
        </div>
        
        <div className="filter-actions">
          <button onClick={clearFilters} className="btn btn-outline">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="results-header">
        <h2>Candidates ({filteredCandidates.length})</h2>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Candidates Found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="candidates-list">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.user_id} className="candidate-card">
              <div className="candidate-header">
                <div className="candidate-avatar">
                  <FaUser />
                </div>
                <div className="candidate-info">
                  <h3>{candidate.full_name}</h3>
                  <p>{candidate.email}</p>
                  <p>{candidate.phone}</p>
                </div>
              </div>
              
              <div className="candidate-details">
                <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <div>
                    <h4>Experience</h4>
                    <p>{candidate.experience_years || 0} years</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FaGraduationCap className="detail-icon" />
                  <div>
                    <h4>Skills</h4>
                    <div className="skills-list">
                      {candidate.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="skill-tag">+{candidate.skills.length - 5} more</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div>
                    <h4>Preferred Locations</h4>
                    <div className="locations-list">
                      {candidate.preferred_locations.slice(0, 3).map((location, index) => (
                        <span key={index} className="location-tag">{location}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="candidate-actions">
                <button className="btn btn-outline">
                  View Profile
                </button>
                <button className="btn btn-primary">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .candidates-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .header p {
          margin: 0;
          color: #666;
        }
        
        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-state h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .error-state p {
          margin: 0 0 20px 0;
          color: #666;
        }
        
        .search-filters {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        
        .filter-group label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        
        .filter-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .filter-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .results-header {
          background: white;
          border-radius: 8px;
          padding: 15px 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .results-header h2 {
          margin: 0;
          color: #333;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        
        .empty-state h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .empty-state p {
          margin: 0;
          color: #666;
        }
        
        .candidates-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .candidate-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .candidate-header {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .candidate-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #f5f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0070f3;
          font-size: 1.5rem;
        }
        
        .candidate-info h3 {
          margin: 0 0 5px 0;
          color: #333;
        }
        
        .candidate-info p {
          margin: 0 0 3px 0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .candidate-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          display: flex;
          gap: 15px;
        }
        
        .detail-icon {
          color: #0070f3;
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 3px;
        }
        
        .detail-item h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 0.9rem;
        }
        
        .detail-item p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .skills-list, .locations-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        
        .skill-tag, .location-tag {
          background: #f0f0f0;
          color: #666;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .candidate-actions {
          display: flex;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
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
        
        .btn:hover {
          opacity: 0.9;
        }
        
        @media (max-width: 768px) {
          .filter-row {
            grid-template-columns: 1fr;
          }
          
          .candidate-details {
            grid-template-columns: 1fr;
          }
          
          .candidate-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .candidate-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}