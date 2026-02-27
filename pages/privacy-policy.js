import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Privacy Policy</h1>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Introduction</h2>
          <p>At AI Job Portal, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personally identifiable information that you voluntarily provide to us when you register on the site, express interest in obtaining information about us or our products and services, participate in activities on the site, or otherwise contact us.</p>
          
          <h3>Derivative Information</h3>
          <p>Information our servers automatically collect when you access our site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing our site.</p>
          
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To facilitate account creation and logon process</li>
            <li>To personalize your experience on our site</li>
            <li>To fulfill and manage purchases, orders, payments, and other transactions related to our products and services</li>
            <li>To send administrative information to you</li>
            <li>To respond to your inquiries and offer support</li>
            <li>To enforce our terms, conditions, and policies</li>
            <li>To protect our site and business from fraudulent, unauthorized, or illegal activity</li>
          </ul>
          
          <h2>Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations:</p>
          <ul>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party service providers to monitor and analyze the use of our website, to contact you, and to provide customer support.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
          </ul>
          
          <h2>Contact Us</h2>
          <p>If you have questions or comments about this policy, you may email us at privacy@aijobportal.com.</p>
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