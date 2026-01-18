import Link from 'next/link';

export default function FraudAlert() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Fraud Alert</h1>
          <p>Protecting our community from scams and fraudulent activities is our top priority. Please read this information carefully to avoid becoming a victim.</p>
          
          <h2>Common Job Scams to Watch Out For</h2>
          <h3>Phishing Emails</h3>
          <p>Scammers may send fake emails that appear to be from legitimate companies asking for personal information or money.</p>
          <ul>
            <li>Be suspicious of unsolicited job offers</li>
            <li>Never provide bank account or social security information via email</li>
            <li>Verify the sender's email address</li>
          </ul>
          
          <h3>Upfront Payment Requests</h3>
          <p>Legitimate employers never ask for money from job applicants.</p>
          <ul>
            <li>Be wary of requests for equipment fees, training costs, or security deposits</li>
            <li>Never send money to secure a job</li>
            <li>Research the company before providing any financial information</li>
          </ul>
          
          <h3>Work-from-Home Scams</h3>
          <p>Some scams promise easy money with little effort.</p>
          <ul>
            <li>Be skeptical of "get rich quick" schemes</li>
            <li>Research any company offering work-from-home opportunities</li>
            <li>Legitimate remote jobs require real skills and experience</li>
          </ul>
          
          <h2>How to Protect Yourself</h2>
          <ul>
            <li>Research companies thoroughly before applying</li>
            <li>Use our platform's built-in messaging system for all communications</li>
            <li>Never share personal financial information with potential employers</li>
            <li>Meet in person or via video call before accepting any position</li>
            <li>Trust your instincts - if something seems too good to be true, it probably is</li>
          </ul>
          
          <h2>Red Flags to Watch For</h2>
          <ul>
            <li>Poor grammar and spelling in job postings</li>
            <li>Vague job descriptions with no specific duties</li>
            <li>Immediate job offers without interviews</li>
            <li>Requests for personal information early in the process</li>
            <li>Pressure to act quickly or "limited time offers"</li>
          </ul>
          
          <h2>Reporting Suspicious Activity</h2>
          <p>If you encounter suspicious activity on our platform, please report it immediately:</p>
          <ul>
            <li>Use the "Report" button on any job posting or user profile</li>
            <li>Email our security team at security@aijobportal.com</li>
            <li>Call our fraud hotline at +1 (555) 123-4567</li>
          </ul>
          
          <h2>Our Commitment to Your Safety</h2>
          <p>We use advanced AI technology to detect and prevent fraudulent activities on our platform. Our team continuously monitors for suspicious behavior and works with law enforcement when necessary.</p>
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
        
        p, ul {
          line-height: 1.6;
          color: #666;
        }
        
        ul {
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
}