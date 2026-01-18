import Link from 'next/link';

export default function TrustSafety() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Trust & Safety</h1>
          <p>Your safety and trust are fundamental to our platform. We are committed to providing a secure environment for all users.</p>
          
          <h2>Our Safety Measures</h2>
          <h3>Identity Verification</h3>
          <p>We verify the identity of employers to ensure legitimate job postings.</p>
          
          <h3>Fraud Detection</h3>
          <p>Our AI-powered system continuously scans for suspicious activities and fraudulent content.</p>
          
          <h3>Data Encryption</h3>
          <p>All communications and personal data are encrypted to protect your privacy.</p>
          
          <h3>Privacy Protection</h3>
          <p>We never sell your personal information to third parties. See our <Link href="/privacy-policy">Privacy Policy</Link> for details.</p>
          
          <h2>User Safety Tips</h2>
          <h3>For Job Seekers</h3>
          <ul>
            <li>Research employers before applying</li>
            <li>Never pay to apply for a job</li>
            <li>Protect your personal information</li>
            <li>Use our platform's messaging system for communications</li>
            <li>Meet in public places for interviews</li>
            <li>Trust your instincts</li>
          </ul>
          
          <h3>For Employers</h3>
          <ul>
            <li>Provide accurate job descriptions</li>
            <li>Respect applicant privacy</li>
            <li>Follow equal opportunity employment laws</li>
            <li>Conduct fair and respectful interviews</li>
            <li>Report suspicious user behavior</li>
          </ul>
          
          <h2>Community Guidelines</h2>
          <p>All users must adhere to our community guidelines:</p>
          <ul>
            <li>Be respectful and professional</li>
            <li>No harassment or discrimination</li>
            <li>No spam or promotional content</li>
            <li>Accurate and honest information only</li>
            <li>Compliance with all applicable laws</li>
          </ul>
          
          <h2>Reporting Issues</h2>
          <p>If you encounter any issues or violations:</p>
          <ul>
            <li>Use the "Report" button on profiles or job postings</li>
            <li>Email our safety team at safety@aijobportal.com</li>
            <li>Call our safety hotline at +1 (555) 123-4567</li>
          </ul>
          
          <h2>Our Response Process</h2>
          <p>When we receive reports:</p>
          <ol>
            <li>Initial review within 24 hours</li>
            <li>Investigation if necessary</li>
            <li>Appropriate action taken</li>
            <li>Follow-up with reporting user</li>
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
          max-width: 800px;
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
        
        h3 {
          color: #555;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        p, ul, ol {
          line-height: 1.6;
          color: #666;
        }
        
        ul, ol {
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
}