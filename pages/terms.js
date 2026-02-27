import Link from 'next/link';

export default function Terms() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Terms and Conditions</h1>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Introduction</h2>
          <p>Welcome to AI Job Portal. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
          <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use AI Job Portal if you do not agree to all of the terms and conditions stated on this page.</p>
          
          <h2>Intellectual Property Rights</h2>
          <p>Unless otherwise stated, AI Job Portal and/or its licensors own the intellectual property rights for all material on AI Job Portal. All intellectual property rights are reserved.</p>
          
          <h2>User Responsibilities</h2>
          <p>As a user of our platform, you agree to the following:</p>
          <ul>
            <li>You will provide accurate and complete information when creating your account</li>
            <li>You will keep your account information updated</li>
            <li>You will not use the platform for any unlawful purposes</li>
            <li>You will not attempt to gain unauthorized access to our systems</li>
            <li>You will not upload or transmit any viruses or malicious code</li>
            <li>You will respect the rights of other users and employers</li>
          </ul>
          
          <h2>Job Seekers</h2>
          <p>As a job seeker, you agree to:</p>
          <ul>
            <li>Provide truthful information in your profile and applications</li>
            <li>Not apply for positions fraudulently</li>
            <li>Respond professionally to employer communications</li>
            <li>Respect the time and resources of employers</li>
          </ul>
          
          <h2>Employers</h2>
          <p>As an employer, you agree to:</p>
          <ul>
            <li>Post accurate job descriptions and requirements</li>
            <li>Treat all applicants fairly and respectfully</li>
            <li>Comply with all applicable employment laws and regulations</li>
            <li>Not misuse the personal information of job seekers</li>
          </ul>
          
          <h2>Limitation of Liability</h2>
          <p>In no event shall AI Job Portal, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
          <ul>
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          
          <h2>Changes to These Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at terms@aijobportal.com.</p>
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