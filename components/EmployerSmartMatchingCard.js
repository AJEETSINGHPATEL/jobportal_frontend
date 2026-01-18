import { FaUserCheck, FaLightbulb, FaChartLine, FaStar } from 'react-icons/fa';
import Link from 'next/link';

const EmployerSmartMatchingCard = ({ title, description, matchPercentage, candidateInfo, candidateId }) => {
  return (
    <Link href={`/candidate/${candidateId || 1}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none' }}>
        <div className="smart-matching-card">
          <div className="card-header">
            <div className="card-icon">
              <FaUserCheck />
            </div>
            <div className="match-score">
              <span className="percentage">{matchPercentage}%</span>
              <span className="label">Match</span>
            </div>
          </div>
          
          <div className="card-content">
            <h3 className="candidate-name">{title}</h3>
            <p className="candidate-description">{description}</p>
            
            <div className="candidate-details">
              <div className="detail-item">
                <FaLightbulb className="detail-icon" />
                <span>{candidateInfo.skills}</span>
              </div>
              <div className="detail-item">
                <FaChartLine className="detail-icon" />
                <span>{candidateInfo.experience}</span>
              </div>
              <div className="detail-item">
                <FaStar className="detail-icon" />
                <span>{candidateInfo.cultureFit}% Cultural Fit</span>
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <button 
              className="view-profile-btn" 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/candidate/${candidateId || 1}`;
              }}
            >
              View Profile
            </button>
            <button 
              className="shortlist-btn" 
              onClick={(e) => {
                e.stopPropagation();
                alert('Added to shortlist!');
              }}
            >
              Shortlist
            </button>
          </div>
          
          <style jsx>{`
            .smart-matching-card {
              background: white;
              border-radius: 16px;
              padding: 1.5rem;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
              border: 1px solid #e2e8f0;
              transition: all 0.3s ease;
              cursor: pointer;
              position: relative;
              overflow: hidden;
            }
            
            .smart-matching-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
              border-color: #3b82f6;
            }
            
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 1rem;
            }
            
            .card-icon {
              width: 48px;
              height: 48px;
              background: linear-gradient(135deg, #2563eb, #3b82f6);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 1.2rem;
            }
            
            .match-score {
              text-align: right;
            }
            
            .percentage {
              display: block;
              font-size: 1.5rem;
              font-weight: 700;
              color: #2563eb;
            }
            
            .label {
              font-size: 0.75rem;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .card-content {
              margin-bottom: 1.5rem;
            }
            
            .candidate-name {
              font-size: 1.25rem;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 0.5rem;
            }
            
            .candidate-description {
              color: #64748b;
              font-size: 0.9rem;
              line-height: 1.5;
              margin-bottom: 1rem;
            }
            
            .candidate-details {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            }
            
            .detail-item {
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }
            
            .detail-icon {
              color: #2563eb;
              font-size: 0.9rem;
            }
            
            .card-footer {
              display: flex;
              gap: 0.75rem;
            }
            
            .view-profile-btn, .shortlist-btn {
              flex: 1;
              padding: 0.75rem 1rem;
              border: none;
              border-radius: 8px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
              font-size: 0.9rem;
            }
            
            .view-profile-btn {
              background: #f1f5f9;
              color: #475569;
            }
            
            .view-profile-btn:hover {
              background: #e2e8f0;
            }
            
            .shortlist-btn {
              background: linear-gradient(135deg, #2563eb, #3b82f6);
              color: white;
            }
            
            .shortlist-btn:hover {
              background: linear-gradient(135deg, #1d4ed8, #2563eb);
              transform: scale(1.02);
            }
          `}</style>
        </div>
      </a>
    </Link>
  );
};

export default EmployerSmartMatchingCard;