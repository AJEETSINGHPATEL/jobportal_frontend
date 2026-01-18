import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, location });
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .search-bar {
          background: #0070f3;
          padding: 2rem 1rem;
          margin-bottom: 2rem;
        }
        
        .search-form {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .search-input-group {
          display: flex;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .search-input {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .search-button {
          background: #ff9900;
          color: white;
          border: none;
          padding: 0 2rem;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1rem;
        }
        
        @media (max-width: 768px) {
          .search-input-group {
            flex-direction: column;
          }
          
          .search-button {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}