import Link from 'next/link';
import { useState } from 'react';
import { FaBriefcase, FaSearch, FaBars, FaTimes, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function HeaderBanner() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-banner">
      {/* Main Background Image */}
      <div className="banner-background">
        <img 
          src="/images/Gemini_Generated_Image_xz7dhrxz7dhrxz7d.png" 
          alt="Career Background" 
          className="background-image"
        />
        <div className="overlay-gradient"></div>
      </div>
      

      
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <Link href="/" className="logo-link">
              <div className="logo-wrapper">
                <FaBriefcase className="logo-icon" />
                <span className="logo-text">CareerHub</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className={`nav-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="/jobs" className="nav-link">Find Jobs</Link></li>
            <li><Link href="/companies" className="nav-link">Companies</Link></li>
            <li><Link href="/services" className="nav-link">Services</Link></li>
            <li><Link href="/resources" className="nav-link">Resources</Link></li>
            <li><Link href="/about" className="nav-link">About</Link></li>
          </ul>

          {/* Auth Buttons */}
          <div className="nav-auth">
            <Link href="/login" className="btn btn-outline">
              <FaSignInAlt /> Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              <FaUserPlus /> Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Hero Banner Content */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">AI-Powered Career Platform</span>
            </div>
            
            <h1 className="hero-title">
              Find Your Dream Job
              <span className="title-highlight">With AI Assistance</span>
            </h1>
            
            <p className="hero-subtitle">
              Connect with top companies and accelerate your career with our intelligent 
              job matching technology. Join thousands of professionals who found success.
            </p>
            
            {/* Search Bar */}
            <div className="hero-search">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company"
                  className="search-input"
                />
                <input 
                  type="text" 
                  placeholder="Location"
                  className="search-input"
                />
                <button className="search-button">
                  <FaSearch /> Search Jobs
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Happy Candidates</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2,500+</div>
                <div className="stat-label">Top Companies</div>
              </div>
            </div>
          </div>


        </div>
        

      </div>

      <style jsx>{`
        .header-banner {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #333;
          overflow: hidden;
        }

        /* Background Image with Overlay */
        .banner-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .background-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .overlay-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg, 
            rgba(237, 242, 251, 0.4) 0%, 
            rgba(219, 234, 254, 0.4) 100%
          );
        }

        /* Glass Effect Elements */
        .glass-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          overflow: hidden;
        }



        /* Top Navigation with Glass Effect */
        .top-nav {
          position: relative;
          z-index: 100;
          background: rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .nav-logo .logo-link {
          text-decoration: none;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 2rem;
          color: #2563eb;
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-link {
          color: rgba(37, 99, 235, 0.9);
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #1e40af;
          background: rgba(237, 242, 251, 0.5);
        }

        .nav-auth {
          display: flex;
          gap: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(45deg, #2563eb, #3b82f6);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: #2563eb;
          border: 2px solid rgba(37, 99, 235, 0.5);
        }

        .btn-outline:hover {
          background: rgba(37, 99, 235, 0.1);
          border-color: #2563eb;
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 4rem 2rem;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content {
          z-index: 10;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(35px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .hero-badge {
          margin-bottom: 2rem;
        }

        .badge-text {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #1e3a8a;
        }

        .title-highlight {
          display: block;
          background: linear-gradient(45deg, #2563eb, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 600px;
          color: #1e3a8a;
        }

        .hero-search {
          margin-bottom: 3rem;
        }

        .search-container {
          display: flex;
          gap: 1rem;
          background: white;
          border-radius: 50px;
          padding: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .search-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          outline: none;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(45deg, #2563eb, #3b82f6);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          color: #2563eb;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #2563eb;
        }

        /* Featured Jobs with Glass Effect */
        .hero-featured {
          z-index: 10;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .featured-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .featured-header h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .featured-header p {
          opacity: 0.8;
          margin: 0;
        }

        .featured-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .featured-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 1.5rem;
          color: #333;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .featured-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .company-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .job-type {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .job-type.contract {
          background: #fef3c7;
          color: #d97706;
        }

        .job-type.remote {
          background: #dcfce7;
          color: #16a34a;
        }

        .featured-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .company-name {
          color: #6b7280;
          margin: 0 0 1rem 0;
          font-size: 0.95rem;
        }

        .job-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .salary {
          font-weight: 700;
          color: #059669;
        }



        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.8rem;
          }
          
          .search-container {
            flex-direction: column;
          }
          
          .hero-stats {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }
          
          .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(102, 126, 234, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
            transition: clip-path 0.3s ease;
          }
          
          .nav-menu.mobile-open {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
          
          .mobile-toggle {
            display: block;
          }
          
          .nav-auth {
            display: none;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .featured-cards {
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem;
          }
          
          .search-container {
            padding: 0.25rem;
          }
          
          .search-input {
            padding: 0.75rem 1rem;
          }
          
          .search-button {
            padding: 0.75rem 1.5rem;
          }
        }
      `}</style>
    </header>
  );
}