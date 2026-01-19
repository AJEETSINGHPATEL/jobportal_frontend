import Head from 'next/head';
import Link from 'next/link';
import { FaLightbulb, FaChartBar, FaRobot, FaThumbsUp } from 'react-icons/fa';

export default function EmployerPage() {
  return (
    <div className="employer-page">
      <Head>
        <title>For Employers | CareerHub</title>
        <meta name="description" content="Leverage AI to find and hire the best talent" />
        <link rel="icon" href="/images/icon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/images/icon.jpg" />
      </Head>

      {/* Header Section */}
      <header className="employer-header">
        <div className="container">
          <h1>Leverage AI to find and hire the best talent</h1>
          <p>Transform your recruitment process with our AI-powered platform</p>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="icon">
                <FaLightbulb size={40} />
              </div>
              <h3>Smart Candidate Matching</h3>
              <p>Our AI analyzes resumes and job descriptions to find the best matches.</p>
              <Link href="/employer/smart-matching" className="feature-link">
                View Matches
              </Link>
            </div>

            <div className="feature-card">
              <div className="icon">
                <FaChartBar size={40} />
              </div>
              <h3>Advanced Analytics</h3>
              <p>Track your hiring metrics and optimize your recruitment process.</p>
            </div>

            <div className="feature-card">
              <div className="icon">
                <FaRobot size={40} />
              </div>
              <h3>AI Interview Assistant</h3>
              <p>Automated screening and interview scheduling to save time.</p>
            </div>

            <div className="feature-card">
              <div className="icon">
                <FaThumbsUp size={40} />
              </div>
              <h3>Candidate Ranking</h3>
              <p>Rank candidates based on skills, experience, and cultural fit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to revolutionize your hiring process?</h2>
          <p>Join hundreds of companies already using our AI-powered recruitment platform</p>
          <div className="cta-buttons">
            <Link href="/register?role=employer" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .employer-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        .employer-header {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .employer-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .employer-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .features-section {
          padding: 4rem 0;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .feature-link {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .feature-link:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          transform: translateY(-2px);
        }

        .icon {
          color: #2563eb;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          background: #333;
          color: white;
          padding: 4rem 0;
          text-align: center;
        }

        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .cta-section p {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 2rem;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin: 0 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: white;
          color: #333;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .employer-header h1 {
            font-size: 2rem;
          }
          
          .feature-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .btn {
            margin: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}