import Link from 'next/link';

export default function Help() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Help Center</h1>
          <p>Welcome to our Help Center. Here you'll find answers to common questions and guidance on using our platform.</p>
          
          <h2>Getting Started</h2>
          <h3>For Job Seekers</h3>
          <ol>
            <li>Create an account by clicking "Get Started" on the homepage</li>
            <li>Complete your profile with your skills, experience, and preferences</li>
            <li>Upload your resume for better job matches</li>
            <li>Browse jobs and apply to positions that match your interests</li>
            <li>Track your applications in the "Applications" section</li>
          </ol>
          
          <h3>For Employers</h3>
          <ol>
            <li>Create an employer account</li>
            <li>Verify your company information</li>
            <li>Post job openings using our AI-assisted job posting tool</li>
            <li>Review applications and rank candidates using our AI-powered system</li>
            <li>Communicate with candidates through our messaging system</li>
          </ol>
          
          <h2>Frequently Asked Questions</h2>
          <h3>How do I reset my password?</h3>
          <p>Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
          
          <h3>How can I improve my job matches?</h3>
          <p>Ensure your profile is complete with detailed information about your skills, experience, and preferences. Upload a current resume for our AI system to analyze.</p>
          
          <h3>How do I contact an employer?</h3>
          <p>Once you've applied for a position, you can communicate with employers through our messaging system in your dashboard.</p>
          
          <h3>How do I post a job as an employer?</h3>
          <p>Log in to your employer account and navigate to the "Post Job" section. Our AI assistant will help you create an effective job posting.</p>
          
          <h2>Contact Support</h2>
          <p>If you can't find an answer to your question, please contact our support team:</p>
          <ul>
            <li>Email: support@aijobportal.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Hours: Monday-Friday, 9AM-5PM EST</li>
          </ul>
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
        
        p, ol, ul {
          line-height: 1.6;
          color: #666;
        }
        
        ol, ul {
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
}