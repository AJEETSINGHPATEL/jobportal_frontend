import Link from 'next/link';

export default function Careers() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>Careers</h1>
          <p>Join our team and help shape the future of employment technology.</p>
          
          <h2>Why Work With Us?</h2>
          <ul>
            <li>Innovative AI technology</li>
            <li>Fast-paced environment</li>
            <li>Competitive compensation</li>
            <li>Opportunities for growth</li>
            <li>Remote work options</li>
            <li>Diverse and inclusive workplace</li>
          </ul>
          
          <h2>Current Openings</h2>
          <p>We're always looking for talented individuals. Check back soon for our latest positions.</p>
          
          <h2>Our Culture</h2>
          <p>We believe in fostering a collaborative environment where innovation thrives. Our team values transparency, continuous learning, and making a positive impact on people's lives through technology.</p>
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