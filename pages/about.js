import Link from 'next/link';

export default function About() {
  return (
    <div className="container">
      <main className="main">
        <div className="content">
          <h1>About Us</h1>
          <p>Welcome to our AI Job Portal. We connect talented professionals with great companies using advanced AI technology.</p>
          
          <h2>Our Mission</h2>
          <p>To revolutionize the job search process by leveraging artificial intelligence to match candidates with their ideal positions.</p>
          
          <h2>Our Vision</h2>
          <p>To become the leading AI-powered employment platform that benefits both job seekers and employers worldwide.</p>
          
          <h2>Our Team</h2>
          <p>Our team consists of experienced professionals in HR technology, artificial intelligence, and software development, all passionate about transforming the employment landscape.</p>
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
      `}</style>
    </div>
  );
}