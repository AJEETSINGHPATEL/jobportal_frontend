import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import EmployerSmartMatchingCard from '../../components/EmployerSmartMatchingCard';
import { FaLightbulb, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

export default function SmartMatchingPage() {
  const [candidates] = useState([
    {
      id: 1,
      title: "Sarah Johnson",
      description: "Senior Software Engineer with 8 years of experience in React and Node.js. Strong leadership skills and passion for mentoring junior developers.",
      matchPercentage: 98,
      candidateInfo: {
        skills: "React, Node.js, TypeScript, AWS",
        experience: "8 years",
        cultureFit: 95
      }
    },
    {
      id: 2,
      title: "Michael Chen",
      description: "Full-stack developer specializing in JavaScript technologies. Proven track record of delivering scalable applications and improving team productivity.",
      matchPercentage: 94,
      candidateInfo: {
        skills: "JavaScript, Vue.js, Python, Docker",
        experience: "6 years",
        cultureFit: 88
      }
    },
    {
      id: 3,
      title: "Emma Rodriguez",
      description: "Frontend specialist with expertise in modern UI/UX frameworks. Excellent communicator and collaborative team player.",
      matchPercentage: 92,
      candidateInfo: {
        skills: "React, Angular, CSS, Redux",
        experience: "5 years",
        cultureFit: 96
      }
    },
    {
      id: 4,
      title: "David Kim",
      description: "Backend engineer with strong focus on system architecture and performance optimization. Experience with microservices and cloud platforms.",
      matchPercentage: 89,
      candidateInfo: {
        skills: "Java, Spring Boot, MongoDB, Kubernetes",
        experience: "7 years",
        cultureFit: 85
      }
    },
    {
      id: 5,
      title: "Priya Sharma",
      description: "DevOps engineer with CI/CD expertise and security-first mindset. Proven ability to streamline deployment processes.",
      matchPercentage: 87,
      candidateInfo: {
        skills: "AWS, Docker, Jenkins, Terraform",
        experience: "6 years",
        cultureFit: 92
      }
    },
    {
      id: 6,
      title: "James Wilson",
      description: "Data scientist with strong analytical skills and business acumen. Experience in machine learning and predictive modeling.",
      matchPercentage: 85,
      candidateInfo: {
        skills: "Python, TensorFlow, SQL, Pandas",
        experience: "5 years",
        cultureFit: 89
      }
    }
  ]);

  return (
    <div className="smart-matching-page">
      <Head>
        <title>Smart Candidate Matching | CareerHub</title>
        <meta name="description" content="AI-powered candidate matching for employers" />
      </Head>

      {/* Header Section */}
      <header className="matching-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1>Smart Candidate Matching</h1>
              <p>Our AI analyzes resumes and job descriptions to find the best matches</p>
            </div>
            <div className="header-icon">
              <FaLightbulb size={60} color="#2563eb" />
            </div>
          </div>
        </div>
      </header>

      {/* Controls Section */}
      <section className="controls-section">
        <div className="container">
          <div className="controls-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search candidates by skills, experience, or keywords..." 
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <button className="filter-btn">
                <FaFilter /> Filters
              </button>
              <button className="sort-btn">
                <FaSortAmountDown /> Sort
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Matching Results */}
      <section className="results-section">
        <div className="container">
          <div className="section-header">
            <h2>Top Matches for Your Requirements</h2>
            <p>Showing {candidates.length} candidates matched to your job requirements</p>
          </div>

          <div className="candidates-grid">
            {candidates.map(candidate => (
              <EmployerSmartMatchingCard
                key={candidate.id}
                title={candidate.title}
                description={candidate.description}
                matchPercentage={candidate.matchPercentage}
                candidateInfo={candidate.candidateInfo}
                candidateId={candidate.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Our AI Matching Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Job Description Analysis</h3>
              <p>Our AI parses your job posting to understand required skills, experience, and qualifications.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Resume Processing</h3>
              <p>We analyze candidate resumes, portfolios, and profiles to extract relevant skills and experience.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Intelligent Matching</h3>
              <p>Advanced algorithms compare job requirements with candidate profiles for optimal matches.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Ranking & Scoring</h3>
              <p>Candidates are ranked based on skill alignment, experience, and cultural fit predictions.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .smart-matching-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .matching-header {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: white;
          padding: 3rem 0;
          text-align: center;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .header-text h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .header-text p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .header-icon {
          margin-top: 1rem;
        }

        .controls-section {
          padding: 2rem 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .controls-container {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .filter-controls {
          display: flex;
          gap: 0.75rem;
        }

        .filter-btn, .sort-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover, .sort-btn:hover {
          border-color: #3b82f6;
          color: #2563eb;
        }

        .results-section {
          padding: 3rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .how-it-works {
          background: white;
          padding: 4rem 0;
          border-top: 1px solid #e2e8f0;
        }

        .how-it-works h2 {
          text-align: center;
          font-size: 2rem;
          color: #1e293b;
          margin-bottom: 3rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .step-card {
          text-align: center;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #dbeafe;
          color: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin: 0 auto 1.5rem;
        }

        .step-card h3 {
          font-size: 1.25rem;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .step-card p {
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .controls-container {
            flex-direction: column;
          }

          .candidates-grid {
            grid-template-columns: 1fr;
          }

          .header-text h1 {
            font-size: 2rem;
          }

          .matching-header {
            padding: 2rem 0;
          }
        }
      `}</style>
    </div>
  );
}