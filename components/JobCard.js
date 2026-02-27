import Link from 'next/link';
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaStar, FaHeart, FaEye, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function JobCard({ job, onApply }) {
  // Format salary based on min/max values
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `₹${job.salary_min.toLocaleString()}+`;
    } else if (job.salary) {
      return `₹${job.salary.toLocaleString()}`;
    }
    return 'Not disclosed';
  };

  // Format experience
  const formatExperience = () => {
    if (job.experience_required) {
      return job.experience_required;
    } else if (job.experience_min && job.experience_max) {
      return `${job.experience_min}-${job.experience_max} yrs`;
    } else if (job.experience_min) {
      return `${job.experience_min}+ yrs`;
    }
    return 'Not specified';
  };

  // Format posted date
  const formatPostedDate = () => {
    if (job.posted_at) {
      const postedDate = new Date(job.posted_at);
      const today = new Date();
      const diffTime = Math.abs(today - postedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    }
    return 'Recently';
  };

  return (
    <div className="naukri-job-card">
      <div className="job-card-content">
        <div className="job-company-logo">
          <div className="logo-placeholder">
            <FaBriefcase />
          </div>
        </div>

        <div className="job-details">
          <div className="job-header-info">
            <h3 className="job-title">{job.title || 'Untitled Position'}</h3>
            <button className="save-job-btn">
              <FaHeart />
            </button>
          </div>

          <div className="company-info">
            <span className="company-name">{job.company || 'Not specified'}</span>
            <span className="company-rating">
              <FaStar /> {job.company_rating || '4.2'} | {job.reviews_count || '1.2k'} reviews
            </span>
          </div>

          <div className="job-meta">
            <span className="experience-badge">
              {formatExperience()}
            </span>
            <span className="salary-range">
              <FaRupeeSign /> {formatSalary()}
            </span>
            <span className="job-location">
              <FaMapMarkerAlt /> {job.location || 'Not specified'}
            </span>
          </div>

          <div className="job-posted">
            {formatPostedDate()}
            {job.employer_phone && (
              <span className="contact-info">
                <FaPhone style={{ marginLeft: '15px', marginRight: '5px' }} /> {job.employer_phone}
              </span>
            )}
            {job.employer_email && (
              <span className="contact-info">
                <FaEnvelope style={{ marginLeft: '15px', marginRight: '5px' }} /> {job.employer_email}
              </span>
            )}
          </div>

          <div className="job-skills">
            {(job.skills || ['JavaScript', 'React', 'Node.js']).slice(0, 5).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>

          <div className="job-description">
            {job.description ? job.description.substring(0, 150) + '...' : 'No description provided'}
          </div>
        </div>
      </div>

      <div className="job-card-actions">
        <Link href={`/jobs/${job.id || job._id}`} className="btn btn-outline">
          <FaEye /> View Details
        </Link>

        <button className="btn btn-primary" onClick={() => onApply(job.id || job._id)}>
          Apply
        </button>
      </div>

      <style jsx>{`
        .naukri-job-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          margin-bottom: 15px;
        }

        .naukri-job-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .job-card-content {
          display: flex;
          gap: 20px;
        }

        .job-company-logo {
          flex-shrink: 0;
        }

        .logo-placeholder {
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

        .job-details {
          flex: 1;
        }

        .job-header-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .job-title {
          margin: 0 0 5px 0;
          font-size: 1.2rem;
          color: #333;
          font-weight: 600;
        }

        .save-job-btn {
          background: none;
          border: none;
          color: #ccc;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .save-job-btn:hover {
          color: #e00;
          background: #ffe6e6;
        }

        .company-info {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
        }

        .company-name {
          font-weight: 500;
          color: #333;
        }

        .company-rating {
          color: #666;
          font-size: 0.9rem;
        }

        .job-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .experience-badge, .salary-range, .job-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9rem;
          color: #666;
        }

        .experience-badge {
          background: #e8f4ff;
          padding: 3px 8px;
          border-radius: 4px;
          color: #0070f3;
          font-weight: 500;
        }

        .job-posted {
          color: #888;
          font-size: 0.8rem;
          margin-bottom: 10px;
        }

        .job-skills {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .skill-tag {
          background: #f0f0f0;
          color: #666;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .job-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 15px;
        }

        .job-card-actions {
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
          font-size: 0.9rem;
        }

        .btn-primary {
          background: #0070f3;
          color: white;
          flex: 1;
        }

        .btn-outline {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }

        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}