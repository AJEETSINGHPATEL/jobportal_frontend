import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaPhone, FaMapMarker, FaGraduationCap, FaBriefcase, FaCode } from 'react-icons/fa';

export default function CandidateProfile() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="candidate-profile">
      <Head>
        <title>Candidate Profile | CareerHub</title>
        <meta name="description" content="View candidate profile and details" />
        <link rel="icon" href="/images/icon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/icon.jpg" />
      </Head>

      <div className="profile-header">
        <div className="container">
          <Link href="/employer/smart-matching" className="back-link">
            <FaArrowLeft /> Back to Matches
          </Link>
          
          <div className="profile-overview">
            <div className="profile-info">
              <h1>{candidate.name}</h1>
              <h2>{candidate.title}</h2>
              <div className="location">
                <FaMapMarker /> {candidate.location}
              </div>
              
              <div className="contact-info">
                <div className="contact-item">
                  <FaEnvelope /> {candidate.email}
                </div>
                <div className="contact-item">
                  <FaPhone /> {candidate.phone}
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="action-btn primary">Schedule Interview</button>
              <button className="action-btn secondary">Send Message</button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="container">
          <div className="profile-grid">
            <div className="main-content">
              <section className="summary-section">
                <h3>About</h3>
                <p>{candidate.summary}</p>
              </section>

              <section className="experience-section">
                <h3><FaBriefcase /> Experience</h3>
                <div className="experience-list">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <h4>{exp.position}</h4>
                        <div className="experience-company">{exp.company}</div>
                      </div>
                      <div className="experience-duration">{exp.duration}</div>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="sidebar">
              <section className="skills-section">
                <h3><FaCode /> Skills</h3>
                <div className="skills-grid">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="education-section">
                <h3><FaGraduationCap /> Education</h3>
                <div className="education-list">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-degree">{edu.degree}</div>
                      <div className="education-school">{edu.school}</div>
                      <div className="education-year">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="actions-sidebar">
                <button className="action-btn full primary">Download Resume</button>
                <button className="action-btn full secondary">Add to Favorites</button>
                <button className="action-btn full outline">Share Profile</button>
              </section>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .candidate-profile {
          min-height: 100vh;
          background: #f8fafc;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          margin: 2rem 0 1rem;
        }

        .back-link:hover {
          color: #1d4ed8;
        }

        .profile-header {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem 0;
        }

        .profile-overview {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 3rem;
        }

        .profile-info h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .profile-info h2 {
          font-size: 1.5rem;
          color: #64748b;
          margin: 0 0 1rem 0;
          font-weight: 400;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #475569;
        }

        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-self: flex-start;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 1rem;
        }

        .action-btn.primary {
          background: #2563eb;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1d4ed8;
        }

        .action-btn.secondary {
          background: #f1f5f9;
          color: #2563eb;
          border: 1px solid #cbd5e1;
        }

        .action-btn.secondary:hover {
          background: #e2e8f0;
        }

        .action-btn.outline {
          background: transparent;
          color: #2563eb;
          border: 1px solid #2563eb;
        }

        .action-btn.outline:hover {
          background: #eff6ff;
        }

        .action-btn.full {
          width: 100%;
        }

        .profile-content {
          padding: 3rem 0;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        section h3 {
          color: #1e293b;
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .summary-section p {
          color: #475569;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .experience-item {
          border-left: 3px solid #dbeafe;
          padding-left: 1.5rem;
        }

        .experience-header h4 {
          color: #1e293b;
          margin: 0 0 0.25rem 0;
          font-size: 1.2rem;
        }

        .experience-company {
          color: #64748b;
          font-weight: 500;
        }

        .experience-duration {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .education-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .education-item {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1rem;
        }

        .education-item:last-child {
          border-bottom: none;
        }

        .education-degree {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .education-school {
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .education-year {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .actions-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .profile-overview {
            flex-direction: column;
            gap: 2rem;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .profile-info h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}