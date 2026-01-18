import { useState, useEffect } from 'react';

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll use mock data
    setCompany({
      id: '1',
      name: 'Tech Innovations Inc',
      description: 'Leading technology company specializing in AI and machine learning solutions.',
      website: 'https://techinnovations.com',
      industry: 'Technology',
      size: '201-500 employees',
      founded: 2010,
      headquarters: 'San Francisco, CA',
      isVerified: true
    });
    
    setJobs([
      {
        id: '1',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $150,000',
        posted: '2023-03-10'
      },
      {
        id: '2',
        title: 'Product Manager',
        location: 'Remote',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        posted: '2023-03-05'
      },
      {
        id: '3',
        title: 'UX Designer',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$100,000 - $130,000',
        posted: '2023-03-01'
      }
    ]);
    
    setReviews([
      {
        id: '1',
        rating: 4.5,
        pros: 'Great work-life balance and supportive team environment',
        cons: 'Limited growth opportunities in some departments',
        author: 'John D.',
        date: '2023-02-15'
      },
      {
        id: '2',
        rating: 5,
        pros: 'Cutting-edge technology stack and challenging projects',
        cons: 'High pressure during product launches',
        author: 'Sarah M.',
        date: '2023-01-22'
      }
    ]);
  }, []);

  return (
    <div className="container">
      {company && (
        <div className="company-header">
          <div className="company-info">
            <h1>{company.name}</h1>
            {company.isVerified && (
              <span className="verified-badge">Verified</span>
            )}
            <p>{company.description}</p>
            
            <div className="company-details">
              <div className="detail">
                <strong>Industry:</strong> {company.industry}
              </div>
              <div className="detail">
                <strong>Company Size:</strong> {company.size}
              </div>
              <div className="detail">
                <strong>Founded:</strong> {company.founded}
              </div>
              <div className="detail">
                <strong>Headquarters:</strong> {company.headquarters}
              </div>
              <div className="detail">
                <strong>Website:</strong> 
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="content">
        <div className="jobs-section">
          <h2>Open Positions</h2>
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <div className="job-details">
                  <span>{job.location}</span>
                  <span>{job.type}</span>
                  <span>{job.salary}</span>
                </div>
                <p>Posted: {job.posted}</p>
                <button>Apply Now</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="reviews-section">
          <h2>Company Reviews</h2>
          <div className="reviews-summary">
            <div className="rating">
              <span className="rating-value">4.3</span>
              <span className="rating-text">Overall Rating</span>
            </div>
            <div className="rating-breakdown">
              <div className="rating-item">
                <span>Work Culture:</span>
                <div className="stars">★★★★☆</div>
              </div>
              <div className="rating-item">
                <span>Salary:</span>
                <div className="stars">★★★★★</div>
              </div>
              <div className="rating-item">
                <span>Management:</span>
                <div className="stars">★★★★☆</div>
              </div>
            </div>
          </div>
          
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-rating">
                    {'★'.repeat(Math.floor(review.rating))}
                    {'☆'.repeat(5 - Math.floor(review.rating))}
                  </div>
                  <div className="review-author">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
                <div className="review-content">
                  <div className="pros">
                    <strong>Pros:</strong>
                    <p>{review.pros}</p>
                  </div>
                  <div className="cons">
                    <strong>Cons:</strong>
                    <p>{review.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem 5%;
          min-height: calc(100vh - 200px);
        }
        
        .company-header {
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .company-header h1 {
          margin-top: 0;
          display: inline-block;
        }
        
        .verified-badge {
          background: #4caf50;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.875rem;
          margin-left: 1rem;
        }
        
        .company-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .detail {
          margin-bottom: 0.5rem;
        }
        
        .detail a {
          margin-left: 0.5rem;
        }
        
        .content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        
        .jobs-section, .reviews-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .jobs-section h2, .reviews-section h2 {
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }
        
        .job-card {
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .job-card h3 {
          margin-top: 0;
        }
        
        .job-details {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .job-details span {
          background: #f5f5f5;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.875rem;
        }
        
        .job-card button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 3px;
          cursor: pointer;
        }
        
        .reviews-summary {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .rating {
          text-align: center;
        }
        
        .rating-value {
          font-size: 2rem;
          font-weight: bold;
          color: #0070f3;
        }
        
        .rating-text {
          display: block;
          color: #666;
        }
        
        .rating-breakdown {
          flex: 1;
        }
        
        .rating-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .stars {
          color: #ffc107;
        }
        
        .review-card {
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .review-rating {
          font-size: 1.25rem;
          color: #ffc107;
        }
        
        .review-author {
          display: flex;
          flex-direction: column;
          text-align: right;
          color: #666;
        }
        
        .review-content .pros, .review-content .cons {
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .content {
            grid-template-columns: 1fr;
          }
          
          .reviews-summary {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}