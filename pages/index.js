import Head from 'next/head';
import Link from 'next/link';
import EmployerButton from '../components/EmployerButton';
import HeaderBannerGlobal from '../components/HeaderBannerGlobal';
import { FaRobot, FaSearch, FaChartLine, FaComments, FaStar, FaShieldAlt, FaBolt, FaUser, FaBriefcase, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>AI Job Portal</title>
        <meta name="description" content="Find your dream job with AI-powered assistance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Global CSS Header Banner */}
      <HeaderBannerGlobal />

      <main className="main">
        {/* For Employers Section */}
        <section className="employers-section">
          <div className="section-header">
            <h2>For Employers</h2>
            <p>Leverage AI to find and hire the best talent</p>
          </div>
          
          <div className="employers-content">
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon bg-blue">
                  <FaSearch />
                </div>
                <h3>Smart Candidate Matching</h3>
                <p>Our AI analyzes resumes and job descriptions to find the best matches.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon bg-green">
                  <FaChartLine />
                </div>
                <h3>Advanced Analytics</h3>
                <p>Track your hiring metrics and optimize your recruitment process.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon bg-purple">
                  <FaComments />
                </div>
                <h3>AI Interview Assistant</h3>
                <p>Automated screening and interview scheduling to save time.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon bg-orange">
                  <FaStar />
                </div>
                <h3>Candidate Ranking</h3>
                <p>Rank candidates based on skills, experience, and cultural fit.</p>
              </div>
            </div>
            
            <div className="employer-cta">
              <h3>Ready to Transform Your Hiring Process?</h3>
              <p>Join thousands of companies using our AI-powered platform</p>
              <div className="employer-buttons">
                <EmployerButton variant="primary" size="large">
                  Employer Dashboard
                </EmployerButton>
                <EmployerButton variant="outline" size="large" href="/post-job">
                  Post a Job
                </EmployerButton>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>AI-Powered Features</h2>
            <p>Our cutting-edge technology enhances your job search experience</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon bg-blue">
                <FaRobot />
              </div>
              <h3>AI Resume Analyzer</h3>
              <p>Get instant feedback on your resume and suggestions for improvement.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon bg-green">
                <FaBolt />
              </div>
              <h3>Smart Job Matching</h3>
              <p>Find jobs that perfectly match your skills and career goals.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon bg-purple">
                <FaShieldAlt />
              </div>
              <h3>Fake Job Detection</h3>
              <p>Stay protected with our AI-powered scam detection system.</p>
            </div>
          </div>
        </section>

        {/* New Feature Cards Section */}
        <section className="feature-cards-section">
          <div className="section-header">
            <h2>AI-Powered Features</h2>
            <p>Explore our advanced AI tools to enhance your job search</p>
          </div>
          
          <div className="feature-cards-grid">
            <Link href="/ai-resume-analyzer" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon bg-blue">
                  <FaRobot />
                </div>
                <h3>AI Resume Analyzer</h3>
                <p>Get instant feedback on your resume and suggestions for improvement.</p>
              </div>
            </Link>
            
            <Link href="/ai-cover-letter" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon bg-green">
                  <FaBolt />
                </div>
                <h3>AI Cover Letter Generator</h3>
                <p>Create personalized cover letters that stand out to employers.</p>
              </div>
            </Link>
            
            <Link href="/ai-interview-prep" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon bg-purple">
                  <FaComments />
                </div>
                <h3>AI Interview Preparation</h3>
                <p>Practice with AI-generated interview questions tailored to your profile.</p>
              </div>
            </Link>
            
            <Link href="/ai-job-matcher" className="feature-card-link">
              <div className="feature-card">
                <div className="feature-icon bg-orange">
                  <FaSearch />
                </div>
                <h3>AI Job Matcher</h3>
                <p>Find jobs that perfectly match your skills and career goals.</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        
        .main {
          flex: 1;
          background: #f5f5f5;
          min-height: calc(100vh - 200px);
        }

        /* Professional Header Banner - TemplateMonster Style */
        .professional-header {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          overflow: hidden;
          color: white;
          padding: 0;
        }
        
        .header-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #2563eb, #3b82f6);
        }
        
        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(37, 99, 235, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%);
        }
        
        .background-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .pattern-circle {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          animation: floatPattern 6s ease-in-out infinite;
        }
        
        .pattern-circle:nth-child(1) {
          top: 10%;
          left: 5%;
          animation-delay: 0s;
        }
        
        .pattern-circle:nth-child(2) {
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }
        
        .pattern-circle:nth-child(3) {
          bottom: 10%;
          left: 20%;
          animation-delay: 4s;
        }
        
        .header-container {
          position: relative;
          max-width: 1600px;
          margin: 0 auto;
          padding: 4rem 5%;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .header-content {
          flex: 1;
          max-width: 600px;
          z-index: 10;
        }
        
        .header-badge {
          margin-bottom: 1.5rem;
        }
        
        .badge-text {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .header-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        
        .title-accent {
          color: #ffd700;
          font-weight: 800;
        }
        
        .header-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        .header-search {
          margin-bottom: 2.5rem;
        }
        
        .search-form {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .search-input-group {
          display: flex;
          gap: 0.5rem;
        }
        
        .search-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.9);
        }
        
        .search-button {
          padding: 1rem 2rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .search-button:hover {
          background: #5a6fd8;
        }
        
        .header-stats {
          display: flex;
          gap: 3rem;
          margin-bottom: 2.5rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .header-featured {
          flex: 1;
          min-width: 400px;
          z-index: 10;
        }
        
        .featured-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          color: #333;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: #333;
        }
        
        .view-all {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        
        .view-all:hover {
          color: #5a6fd8;
        }
        
        .job-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .job-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .job-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .job-company {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          flex: 1;
        }
        
        .company-logo {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .logo-bg {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        
        .job-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
        
        .job-info p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
        
        .job-price {
          font-weight: 700;
          color: #2563eb;
          font-size: 1.1rem;
        }
        
        .job-bottom {
          display: flex;
          gap: 1rem;
        }
        
        .job-type {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .job-remote {
          background: #d1fae5;
          color: #065f46;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .header-cta {
          display: flex;
          gap: 1rem;
        }
        
        .cta-button {
          flex: 1;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        
        .cta-button.primary {
          background: #2563eb;
          color: white;
        }
        
        .cta-button.secondary {
          background: transparent;
          color: #2563eb;
          border: 2px solid #2563eb;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .header-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          line-height: 0;
          overflow: hidden;
        }
        
        .header-wave svg {
          position: relative;
          display: block;
          width: 100%;
          height: 120px;
        }
        
        .header-wave .wave-fill {
          fill: white;
        }
        
        @keyframes floatPattern {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0px) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(-10px);
          }
        }
        
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0px) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(-10px);
          }
        }
        
        @media (max-width: 1024px) {
          .hero-container {
            flex-direction: column;
            padding: 3rem 1rem;
            text-align: center;
          }
          
          .hero-content {
            max-width: 100%;
            margin-bottom: 3rem;
          }
          
          .hero-featured {
            width: 100%;
            min-width: auto;
          }
          
          .section-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .hero-cta {
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .hero-cta {
            flex-direction: column;
            gap: 1rem;
          }
          
          .featured-jobs-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            margin-bottom: 1rem;
          }
        }

        /* Employers Section */
        .employers-section {
          padding: 4rem 5%;
          background: #f8f9fa;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .employers-content {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          color: white;
        }

        .bg-blue { background: #0070f3; }
        .bg-green { background: #28a745; }
        .bg-purple { background: #6f42c1; }
        .bg-orange { background: #ffc107; }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .employer-cta {
          text-align: center;
          background: white;
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .employer-cta h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .employer-cta p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
        }

        .employer-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 5%;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 5%;
        }

        /* Feature Cards Section */
        .feature-cards-section {
          padding: 4rem 5%;
          background: #f8f9fa;
        }

        .feature-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .feature-card-link {
          text-decoration: none;
        }

        .feature-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          color: white;
        }

        .bg-blue { background: #0070f3; }
        .bg-green { background: #28a745; }
        .bg-purple { background: #6f42c1; }
        .bg-orange { background: #ffc107; }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1rem;
          }

          .header-content {
            margin-bottom: 2rem;
          }

          .header-title {
            font-size: 2rem;
          }

          .header-subtitle {
            font-size: 1rem;
          }

          .header-cta {
            justify-content: center;
          }

          .employers-section, .features-section {
            padding: 2rem 1rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .section-header p {
            font-size: 1rem;
          }

          .employer-cta {
            padding: 2rem 1rem;
          }

          .employer-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .header-wave svg {
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
}