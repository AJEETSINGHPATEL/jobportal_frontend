import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/api';
import { FaStar, FaBuilding, FaMapMarkerAlt, FaLink, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function CompanyProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRatings, setAverageRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would decode the token to get user info
      // For now, we'll use mock user data
      setUser({ id: 'mock_user_id', role: 'job_seeker' });
    }
    
    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch company data
      const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}`);
      if (!companyResponse.ok) {
        throw new Error('Company not found');
      }
      const companyData = await companyResponse.json();
      setCompany(companyData);
      
      // Fetch company reviews
      const reviewsData = await api.getCompanyReviews(id);
      setReviews(reviewsData);
      
      // Fetch average ratings
      const avgRatings = await api.getCompanyAverageRatings(id);
      setAverageRatings(avgRatings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="company-profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-profile-page">
        <div className="error-container">
          <h2>Error Loading Company Profile</h2>
          <p>{error}</p>
          <button onClick={() => router.back()} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-profile-page">
        <div className="error-container">
          <h2>Company Not Found</h2>
          <p>The requested company could not be found.</p>
          <button onClick={() => router.back()} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= roundedRating ? 'star-filled' : 'star-empty'} 
        />
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  return (
    <div className="company-profile-page">
      {/* Company Header */}
      <div className="company-header">
        <div className="company-info">
          <div className="company-logo">
            <FaBuilding size={60} />
          </div>
          <div className="company-details">
            <h1>{company.name}</h1>
            <div className="company-meta">
              <div className="company-location">
                <FaMapMarkerAlt /> {company.headquarters}
              </div>
              <div className="company-website">
                <FaLink /> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
              </div>
            </div>
            <div className="company-verification">
              {company.verification_status === 'verified' ? (
                <span className="verified-badge">
                  <FaCheckCircle /> Verified Company
                </span>
              ) : (
                <span className="unverified-badge">
                  <FaExclamationCircle /> Unverified Company
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="company-ratings">
          <div className="rating-summary">
            <div className="overall-rating">
              <span className="rating-value">
                {averageRatings ? averageRatings.average_ratings.work_culture : '0.0'}
              </span>
              <div className="rating-label">Overall Rating</div>
            </div>
            <div className="total-reviews">
              <span className="review-count">
                {averageRatings ? averageRatings.total_reviews : 0} Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="company-description">
        <h2>About {company.name}</h2>
        <p>{company.description}</p>
      </div>

      {/* Company Ratings */}
      <div className="company-ratings-section">
        <h2>Company Ratings</h2>
        <div className="ratings-grid">
          <div className="rating-item">
            <div className="rating-label">Work Culture</div>
            <div className="rating-value">
              {averageRatings ? averageRatings.average_ratings.work_culture.toFixed(1) : '0.0'}
            </div>
            {averageRatings && renderStars(averageRatings.average_ratings.work_culture)}
          </div>
          <div className="rating-item">
            <div className="rating-label">Salary</div>
            <div className="rating-value">
              {averageRatings ? averageRatings.average_ratings.salary.toFixed(1) : '0.0'}
            </div>
            {averageRatings && renderStars(averageRatings.average_ratings.salary)}
          </div>
          <div className="rating-item">
            <div className="rating-label">HR</div>
            <div className="rating-value">
              {averageRatings ? averageRatings.average_ratings.hr.toFixed(1) : '0.0'}
            </div>
            {averageRatings && renderStars(averageRatings.average_ratings.hr)}
          </div>
          <div className="rating-item">
            <div className="rating-label">Management</div>
            <div className="rating-value">
              {averageRatings ? averageRatings.average_ratings.management.toFixed(1) : '0.0'}
            </div>
            {averageRatings && renderStars(averageRatings.average_ratings.management)}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="section-header">
          <h2>Company Reviews</h2>
          {user && user.role === 'job_seeker' && (
            <button className="btn btn-primary">Write Review</button>
          )}
        </div>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this company.</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.user_name || 'Anonymous'}</span>
                    <div className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating_work_culture)}
                  </div>
                </div>
                
                <div className="review-ratings">
                  <div className="sub-rating">
                    <span>Work Culture: </span>
                    {renderStars(review.rating_work_culture)}
                  </div>
                  <div className="sub-rating">
                    <span>Salary: </span>
                    {renderStars(review.rating_salary)}
                  </div>
                  <div className="sub-rating">
                    <span>HR: </span>
                    {renderStars(review.rating_hr)}
                  </div>
                  <div className="sub-rating">
                    <span>Management: </span>
                    {renderStars(review.rating_management)}
                  </div>
                </div>
                
                <div className="review-content">
                  <div className="pros-section">
                    <h4>Pros</h4>
                    <p>{review.pros}</p>
                  </div>
                  
                  <div className="cons-section">
                    <h4>Cons</h4>
                    <p>{review.cons}</p>
                  </div>
                  
                  {review.interview_experience && (
                    <div className="interview-section">
                      <h4>Interview Experience</h4>
                      <p>{review.interview_experience}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .company-profile-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
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

        .company-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 30px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 30px;
        }

        .company-info {
          display: flex;
          gap: 20px;
          flex: 1;
        }

        .company-logo {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 2rem;
        }

        .company-details h1 {
          margin: 0 0 10px 0;
          font-size: 2rem;
          color: #333;
        }

        .company-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 10px;
        }

        .company-meta div {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
        }

        .company-verification {
          margin-top: 10px;
        }

        .verified-badge {
          color: #10B981;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .unverified-badge {
          color: #EF4444;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .company-ratings {
          text-align: right;
        }

        .rating-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          display: inline-block;
        }

        .overall-rating {
          text-align: center;
        }

        .rating-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #0070f3;
        }

        .rating-label {
          font-size: 0.9rem;
          color: #666;
        }

        .total-reviews {
          margin-top: 10px;
        }

        .review-count {
          font-weight: 500;
          color: #666;
        }

        .company-description {
          margin-bottom: 40px;
        }

        .company-description h2 {
          margin-bottom: 15px;
          color: #333;
        }

        .company-description p {
          color: #666;
          line-height: 1.6;
        }

        .company-ratings-section {
          margin-bottom: 40px;
        }

        .company-ratings-section h2 {
          margin-bottom: 20px;
          color: #333;
        }

        .ratings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .rating-item {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .rating-label {
          font-weight: 500;
          color: #666;
          margin-bottom: 10px;
        }

        .rating-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0070f3;
          margin-bottom: 10px;
        }

        .star-rating {
          display: flex;
          justify-content: center;
          gap: 2px;
        }

        .star-filled {
          color: #FFC107;
        }

        .star-empty {
          color: #ddd;
        }

        .reviews-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
          color: #333;
        }

        .no-reviews {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .review-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .reviewer-info {
          flex: 1;
        }

        .reviewer-name {
          font-weight: 500;
          color: #333;
        }

        .review-date {
          color: #888;
          font-size: 0.9rem;
        }

        .review-rating {
          text-align: right;
        }

        .review-ratings {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .sub-rating {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sub-rating span {
          font-weight: 500;
          color: #666;
        }

        .review-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .pros-section, .cons-section, .interview-section {
          padding: 15px;
          border-radius: 6px;
        }

        .pros-section {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .cons-section {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .interview-section {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
        }

        .pros-section h4, .cons-section h4, .interview-section h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .pros-section p, .cons-section p, .interview-section p {
          margin: 0;
          color: #666;
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

        .btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .company-header {
            flex-direction: column;
            gap: 20px;
          }
          
          .company-ratings {
            text-align: left;
            margin-top: 20px;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
