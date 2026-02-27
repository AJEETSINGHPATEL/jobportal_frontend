import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { FaBuilding, FaStar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we would call the API to get companies
      // For now, we'll use mock data
      const mockCompanies = [
        {
          id: '1',
          name: 'TechCorp Solutions',
          description: 'Leading technology company specializing in enterprise software solutions.',
          industry: 'Technology',
          size: '501-1000',
          headquarters: 'Bangalore, India',
          website: 'https://techcorp.com',
          verification_status: 'verified',
          created_at: '2023-01-15T10:30:00Z',
          average_rating: 4.2,
          review_count: 125
        },
        {
          id: '2',
          name: 'Innovate Labs',
          description: 'Innovation-driven company focused on AI and machine learning solutions.',
          industry: 'Artificial Intelligence',
          size: '201-500',
          headquarters: 'Mumbai, India',
          website: 'https://innovatelabs.com',
          verification_status: 'verified',
          created_at: '2023-02-20T14:45:00Z',
          average_rating: 4.5,
          review_count: 89
        },
        {
          id: '3',
          name: 'Global Finance Inc',
          description: 'Financial services company with global presence and local expertise.',
          industry: 'Finance',
          size: '1001-5000',
          headquarters: 'Delhi, India',
          website: 'https://globalfinance.com',
          verification_status: 'pending',
          created_at: '2023-03-10T09:15:00Z',
          average_rating: 3.8,
          review_count: 67
        },
        {
          id: '4',
          name: 'HealthPlus Systems',
          description: 'Healthcare technology company improving patient care through innovation.',
          industry: 'Healthcare',
          size: '101-200',
          headquarters: 'Hyderabad, India',
          website: 'https://healthplus.com',
          verification_status: 'verified',
          created_at: '2023-04-05T16:20:00Z',
          average_rating: 4.0,
          review_count: 54
        },
        {
          id: '5',
          name: 'EduTech Global',
          description: 'Education technology company transforming learning experiences.',
          industry: 'Education',
          size: '51-100',
          headquarters: 'Chennai, India',
          website: 'https://edutechglobal.com',
          verification_status: 'rejected',
          created_at: '2023-05-12T11:30:00Z',
          average_rating: 4.3,
          review_count: 42
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    const matchesSize = !sizeFilter || company.size === sizeFilter;
    const matchesVerified = !verifiedFilter || 
                           (verifiedFilter === 'verified' && company.verification_status === 'verified') ||
                           (verifiedFilter === 'unverified' && company.verification_status !== 'verified');
    
    return matchesSearch && matchesIndustry && matchesSize && matchesVerified;
  });

  const industries = [...new Set(companies.map(company => company.industry))];
  const sizes = [...new Set(companies.map(company => company.size))];

  if (loading) {
    return (
      <div className="companies-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies-page">
        <div className="error-container">
          <h2>Error Loading Companies</h2>
          <p>{error}</p>
          <button onClick={fetchCompanies} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="companies-page">
      <div className="page-header">
        <h1>Companies</h1>
        <p>Explore top companies and read reviews from employees</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search companies by name or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-options">
          <select 
            value={industryFilter} 
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          
          <select 
            value={sizeFilter} 
            onChange={(e) => setSizeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
          
          <select 
            value={verifiedFilter} 
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Verification</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Companies List */}
      <div className="companies-list">
        {filteredCompanies.length === 0 ? (
          <div className="no-companies">
            <p>No companies match your search criteria.</p>
          </div>
        ) : (
          filteredCompanies.map(company => (
            <div key={company.id} className="company-card">
              <div className="company-header">
                <div className="company-logo">
                  <FaBuilding size={40} />
                </div>
                <div className="company-info">
                  <Link href={`/company/${company.id}`}>
                    <h3>{company.name}</h3>
                  </Link>
                  <div className="company-meta">
                    <div className="company-industry">{company.industry}</div>
                    <div className="company-location">
                      <FaMapMarkerAlt /> {company.headquarters}
                    </div>
                  </div>
                </div>
                <div className="company-verification">
                  {company.verification_status === 'verified' ? (
                    <span className="verified-badge">
                      <FaCheckCircle /> Verified
                    </span>
                  ) : (
                    <span className="pending-badge">
                      {company.verification_status === 'pending' ? 'Pending' : 'Unverified'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="company-details">
                <p className="company-description">{company.description}</p>
                
                <div className="company-stats">
                  <div className="rating-section">
                    <div className="rating-value">{company.average_rating}</div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(company.average_rating) ? 'star-filled' : 'star-empty'} 
                        />
                      ))}
                    </div>
                    <div className="review-count">({company.review_count} reviews)</div>
                  </div>
                  
                  <div className="company-size">
                    Size: {company.size} employees
                  </div>
                </div>
              </div>
              
              <div className="company-actions">
                <Link href={`/company/${company.id}`} className="btn btn-outline">
                  View Details
                </Link>
                <Link href={`/jobs?company=${company.name}`} className="btn btn-primary">
                  View Jobs
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .companies-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .loading-container, .error-container {
          text-align: center;
          padding: 50px 20px;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .search-filters {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .search-bar {
          margin-bottom: 15px;
        }

        .search-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .filter-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .filter-select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
        }

        .companies-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .no-companies {
          text-align: center;
          padding: 50px 20px;
          color: #666;
        }

        .company-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .company-header {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 15px;
        }

        .company-logo {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 1.5rem;
        }

        .company-info {
          flex: 1;
        }

        .company-info h3 {
          margin: 0 0 5px 0;
          font-size: 1.3rem;
          color: #333;
        }

        .company-info h3:hover {
          color: #0070f3;
          cursor: pointer;
        }

        .company-meta {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .company-industry {
          color: #0070f3;
          font-weight: 500;
        }

        .company-location {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 0.9rem;
        }

        .company-verification {
          text-align: right;
        }

        .verified-badge {
          color: #10B981;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          justify-content: flex-end;
        }

        .pending-badge {
          color: #F59E0B;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          justify-content: flex-end;
        }

        .company-details {
          margin-bottom: 20px;
        }

        .company-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .company-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rating-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0070f3;
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .star-filled {
          color: #FFC107;
        }

        .star-empty {
          color: #ddd;
        }

        .review-count {
          color: #666;
          font-size: 0.9rem;
        }

        .company-size {
          color: #666;
          font-size: 0.9rem;
        }

        .company-actions {
          display: flex;
          gap: 10px;
          padding-top: 15px;
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
          .company-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .company-verification {
            text-align: left;
          }
          
          .company-stats {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .company-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}