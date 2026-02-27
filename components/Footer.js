import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
           
          <ul>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/employer-home">Employer home</Link></li>
            <li><Link href="/sitemap">Sitemap</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          
          <ul>
            <li><Link href="/help">Help center</Link></li>
            <li><a href="#">Summons/Notices</a></li>
            <li><a href="#">Grievances</a></li>
            <li><a href="#">Report issue</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link href="/privacy-policy">Privacy policy</Link></li>
            <li><Link href="/terms">Terms & conditions</Link></li>
            <li><Link href="/fraud-alert">Fraud alert</Link></li>
            <li><Link href="/trust-safety">Trust & safety</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Apply on the go</h3>
          <p>Get real-time job updates on our App</p>
          <div className="app-links">
            <a href="#" className="app-link">Google Play</a>
            <a href="#" className="app-link">App Store</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>AI Job Portal &copy; {new Date().getFullYear()}</p>
      </div>
      
      <style jsx>{`
        .footer {
          background: #f5f5f5;
          padding: 2rem 0 1rem;
          margin-top: 3rem;
        }
        
        .footer-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 5%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        
        .footer-section h3 {
          margin-top: 0;
          color: #333;
        }
        
        .footer-section ul {
          list-style: none;
          padding: 0;
        }
        
        .footer-section ul li {
          margin-bottom: 0.5rem;
        }
        
        .footer-section ul li a {
          color: #666;
          text-decoration: none;
        }
        
        .footer-section ul li a:hover {
          color: #0070f3;
          text-decoration: underline;
        }
        
        .app-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .app-link {
          background: #000;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.875rem;
        }
        
        .footer-bottom {
          width: 100%;
          max-width: 1600px;
          margin: 2rem auto 0;
          padding: 1rem 5% 0;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}