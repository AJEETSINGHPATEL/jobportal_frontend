import Link from 'next/link';
import { useState } from 'react';
import { FaBriefcase, FaSearch, FaBars, FaTimes, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function HeaderBannerGlobal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-banner-global">
      {/* Background Elements */}
      <div className="banner-background-global">
        <img 
          src="/images/Gemini_Generated_Image_xz7dhrxz7dhrxz7d.png" 
          alt="Career Background" 
          className="background-image-global"
        />
        <div className="overlay-gradient-global"></div>
      </div>
      

      
      {/* Top Navigation Bar */}
      <nav className="top-nav-global">
        <div className="nav-container-global">
          {/* Logo */}
          <div className="nav-logo-global">
            <Link href="/" className="logo-link-global">
              <div className="logo-wrapper-global">
                <FaBriefcase className="logo-icon-global" />
                <span className="logo-text-global">CareerHub</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className={`nav-menu-global ${isMenuOpen ? 'mobile-open' : ''}`}>
            <li><Link href="/" className="nav-link-global">Home</Link></li>
            <li><Link href="/jobs" className="nav-link-global">Find Jobs</Link></li>
            <li><Link href="/companies" className="nav-link-global">Companies</Link></li>
            <li><Link href="/services" className="nav-link-global">Services</Link></li>
            <li><Link href="/resources" className="nav-link-global">Resources</Link></li>
            <li><Link href="/about" className="nav-link-global">About</Link></li>
          </ul>

          {/* Auth Buttons */}
          <div className="nav-auth-global">
            <Link href="/login" className="btn-global btn-outline-global">
              <FaSignInAlt /> Login
            </Link>
            <Link href="/register" className="btn-global btn-primary-global">
              <FaUserPlus /> Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle-global" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Hero Banner Content */}
      <div className="hero-section-global">
        <div className="hero-container-global">
          <div className="hero-content-global">
            <div className="hero-badge-global">
              <span className="badge-text-global">AI-Powered Career Platform</span>
            </div>
            
            <h1 className="hero-title-global">
              Find Your Dream Job
              <span className="title-highlight-global">With AI Assistance</span>
            </h1>
            
            <p className="hero-subtitle-global">
              Connect with top companies and accelerate your career with our intelligent 
              job matching technology. Join thousands of professionals who found success.
            </p>
            
            {/* Search Bar */}
            <div className="hero-search-global">
              <div className="search-container-global">
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company"
                  className="search-input-global"
                />
                <input 
                  type="text" 
                  placeholder="Location"
                  className="search-input-global"
                />
                <button className="search-button-global">
                  <FaSearch /> Search Jobs
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="hero-stats-global">
              <div className="stat-item-global">
                <div className="stat-number-global">10,000+</div>
                <div className="stat-label-global">Active Jobs</div>
              </div>
              <div className="stat-item-global">
                <div className="stat-number-global">50,000+</div>
                <div className="stat-label-global">Happy Candidates</div>
              </div>
              <div className="stat-item-global">
                <div className="stat-number-global">2,500+</div>
                <div className="stat-label-global">Top Companies</div>
              </div>
            </div>
          </div>


        </div>
        

      </div>
    </header>
  );
}