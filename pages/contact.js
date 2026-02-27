import Link from 'next/link';

export default function Contact() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Reach out to us through any of the following channels:</p>
          
          <div className="contact-info">
            <h2>General Inquiries</h2>
            <p>Email: info@aijobportal.com</p>
            
            <h2>Support</h2>
            <p>Email: support@aijobportal.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Hours: Monday-Friday, 9AM-5PM EST</p>
            
            <h2>Press & Media</h2>
            <p>Email: press@aijobportal.com</p>
            
            <h2>Partnerships</h2>
            <p>Email: partnerships@aijobportal.com</p>
            
            <h2>Office Address</h2>
            <p>AI Job Portal Inc.</p>
            <p>123 Tech Street</p>
            <p>San Francisco, CA 94103</p>
            <p>United States</p>
          </div>
          
          <h2>Send Us a Message</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
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
        
        p {
          line-height: 1.6;
          color: #666;
        }
        
        .contact-info p {
          margin: 0.5rem 0;
        }
        
        .contact-form {
          margin-top: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .submit-btn {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .submit-btn:hover {
          background: #0055cc;
        }
      `}</style>
    </div>
  );
}