import Link from 'next/link';

export default function EmployerHome() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Employer Dashboard</h1>
          <p>Welcome to the employer section of AI Job Portal. Manage your job postings, candidates, and company profile here.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3>Post Jobs</h3>
              <p>Create new job postings with our AI-assisted tool</p>
              <Link href="/post-job" className="card-link">Post a Job</Link>
            </div>
            
            <div className="feature-card">
              <h3>Manage Postings</h3>
              <p>View, edit, and track your active job postings</p>
              <Link href="/employer-dashboard" className="card-link">View Jobs</Link>
            </div>
            
            <div className="feature-card">
              <h3>Find Candidates</h3>
              <p>Search our database of qualified candidates</p>
              <Link href="/candidates" className="card-link">Search Candidates</Link>
            </div>
            
            <div className="feature-card">
              <h3>Analytics</h3>
              <p>View insights on your job postings and candidate engagement</p>
              <Link href="/analytics" className="card-link">View Analytics</Link>
            </div>
          </div>
          
          <h2>Why Employers Love Our Platform</h2>
          <ul>
            <li>AI-powered candidate matching saves time and improves quality</li>
            <li>Easy job posting with built-in optimization suggestions</li>
            <li>Comprehensive analytics to track performance</li>
            <li>Access to a diverse pool of qualified candidates</li>
            <li>Secure and compliant hiring process</li>
          </ul>
          
          <h2>Getting Started</h2>
          <ol>
            <li>Create your company profile</li>
            <li>Post your first job opening</li>
            <li>Review AI-ranked candidates</li>
            <li>Connect with top talent</li>
          </ol>
        </div>
      </main>
      
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .main {
          flex: 1;
          padding: 2rem;
        }
        
        .content {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        h1 {
          color: #0070f3;
          margin-bottom: 1rem;
        }
        
        h2 {
          color: #333;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        p {
          line-height: 1.6;
          color: #666;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
        
        .feature-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .feature-card h3 {
          margin-top: 0;
          color: #333;
        }
        
        .feature-card p {
          margin-bottom: 1rem;
        }
        
        .card-link {
          display: inline-block;
          background: #0070f3;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
        }
        
        .card-link:hover {
          background: #0055cc;
        }
        
        ul, ol {
          padding-left: 1.5rem;
          color: #666;
        }
        
        li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}