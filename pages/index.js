import Head from 'next/head';
import Link from 'next/link';
import EmployerButton from '../components/EmployerButton';
import { FaRobot, FaSearch, FaChartLine, FaComments, FaStar, FaShieldAlt, FaBolt, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const LusionHero = dynamic(() => import('../components/LusionHero'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>AI Job Portal</title>
        <meta name="description" content="Find your dream job with AI-powered assistance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Lusion-style 3D animated hero */}
      <LusionHero />

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