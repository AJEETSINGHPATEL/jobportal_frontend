import Link from 'next/link';

export default function Sitemap() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Sitemap</h1>
          <p>Overview of all pages and sections available on AI Job Portal.</p>
          
          <div className="sitemap-section">
            <h2>Main Pages</h2>
            <ul>
              <li><Link href="/">Homepage</Link></li>
              <li><Link href="/jobs">Browse Jobs</Link></li>
              <li><Link href="/companies">Companies</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>
          
          <div className="sitemap-section">
            <h2>For Job Seekers</h2>
            <ul>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/resume">Resume</Link></li>
              <li><Link href="/applications">Applications</Link></li>
              <li><Link href="/job-alerts">Job Alerts</Link></li>
              <li><Link href="/notifications">Notifications</Link></li>
              <li><Link href="/resume-builder">Resume Builder</Link></li>
            </ul>
          </div>
          
          <div className="sitemap-section">
            <h2>For Employers</h2>
            <ul>
              <li><Link href="/employer-home">Employer Home</Link></li>
              <li><Link href="/employer-dashboard">Employer Dashboard</Link></li>
              <li><Link href="/post-job">Post Job</Link></li>
              <li><Link href="/candidates">Find Candidates</Link></li>
              <li><Link href="/analytics">Analytics</Link></li>
            </ul>
          </div>
          
          <div className="sitemap-section">
            <h2>Resources</h2>
            <ul>
              <li><Link href="/resources">Resources</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/trust-safety">Trust & Safety</Link></li>
              <li><Link href="/fraud-alert">Fraud Alert</Link></li>
            </ul>
          </div>
          
          <div className="sitemap-section">
            <h2>AI Features</h2>
            <ul>
              <li><Link href="/ai-demo">AI Demo</Link></li>
              <li><Link href="/resume-builder">AI Resume Builder</Link></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}