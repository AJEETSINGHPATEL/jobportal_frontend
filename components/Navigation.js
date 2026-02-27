import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaUser, FaBriefcase, FaChartBar, FaUsers, FaSignOutAlt, FaFileAlt, FaSignInAlt, FaUserPlus, FaPlus, FaBell } from 'react-icons/fa';

export default function Navigation({ user }) {
  const router = useRouter();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/');
    }
  };

  // Show simplified navigation on auth pages
  const isAuthPage = router.pathname === '/login' || router.pathname === '/signup';

  if (isAuthPage) {
    return (
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">JobPortal</Link>
          </div>
          <div className="nav-auth">
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
        
        <style jsx>{`
          .navigation {
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          
          .nav-container {
            width: 100%;
            max-width: 1600px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 5%;
            height: 70px;
          }
          
          .nav-logo a {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0070f3;
            text-decoration: none;
          }
          
          .nav-auth {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }
          
          .btn-outline {
            background: transparent;
            color: #0070f3;
            border: 1px solid #0070f3;
          }
        `}</style>
      </nav>
    );
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/">JobPortal</Link>
        </div>
        
        <ul className="nav-menu">
          <li className={router.pathname === '/' ? 'active' : ''}>
            <Link href="/">
              <FaHome /> Home
            </Link>
          </li>
          
          <li className={router.pathname === '/jobs' ? 'active' : ''}>
            <Link href="/jobs">
              <FaBriefcase /> Jobs
            </Link>
          </li>
          
          <li className={router.pathname === '/companies' ? 'active' : ''}>
            <Link href="/companies">
              Companies
            </Link>
          </li>
          
          <li className={router.pathname === '/services' ? 'active' : ''}>
            <Link href="/services">
              Services
            </Link>
          </li>
          
          <li className={router.pathname === '/resources' ? 'active' : ''}>
            <Link href="/resources">
              Resources
            </Link>
          </li>
          
          {user?.role === 'job_seeker' && (
            <>
              <li className={router.pathname === '/dashboard' ? 'active' : ''}>
                <Link href="/dashboard">
                  <FaChartBar /> My Dashboard
                </Link>
              </li>
              <li className={router.pathname === '/profile' ? 'active' : ''}>
                <Link href="/profile">
                  <FaUser /> Profile
                </Link>
              </li>
              <li className={router.pathname === '/resume' ? 'active' : ''}>
                <Link href="/resume">
                  <FaFileAlt /> Resume
                </Link>
              </li>
              <li className={router.pathname === '/applications' ? 'active' : ''}>
                <Link href="/applications">
                  <FaChartBar /> My Applications
                </Link>
              </li>
              <li className={router.pathname === '/job-alerts' ? 'active' : ''}>
                <Link href="/job-alerts">
                  <FaBell /> Job Alerts
                </Link>
              </li>
              <li className={router.pathname === '/ai-demo' ? 'active' : ''}>
                <Link href="/ai-demo">
                  <FaChartBar /> AI Demo
                </Link>
              </li>
            </>
          )}
          
          {user?.role === 'employer' && (
            <>
              <li className={router.pathname === '/employer-dashboard' ? 'active' : ''}>
                <Link href="/employer-dashboard">
                  <FaChartBar /> Dashboard
                </Link>
              </li>
              <li className={router.pathname === '/profile' ? 'active' : ''}>
                <Link href="/profile">
                  <FaUser /> Profile
                </Link>
              </li>
              <li className={router.pathname === '/candidates' ? 'active' : ''}>
                <Link href="/candidates">
                  <FaUsers /> Candidates
                </Link>
              </li>
              <li className={router.pathname === '/analytics' ? 'active' : ''}>
                <Link href="/analytics">
                  <FaChartBar /> Analytics
                </Link>
              </li>
              <li className={router.pathname === '/post-job' ? 'active' : ''}>
                <Link href="/post-job">
                  <FaPlus /> Post Job
                </Link>
              </li>
            </>
          )}
        </ul>
        
        <div className="nav-auth">
          {user ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb'
                }}>
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#e5e7eb',
                      color: '#6b7280'
                    }}>
                      <FaUser size={14} />
                    </div>
                  )}
                </div>
                <span style={{ color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                  {user.full_name || user.email}
                </span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                <FaSignInAlt /> Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                <FaUserPlus /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .navigation {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5%;
          height: 70px;
        }
        
        .nav-logo a {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0070f3;
          text-decoration: none;
        }
        
        .nav-menu {
          display: flex;
          list-style: none;
          gap: 5px;
        }
        
        .nav-menu li {
          margin: 0 5px;
        }
        
        .nav-menu a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 6px;
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .nav-menu a:hover,
        .nav-menu .active a {
          background: #f0f2f5;
          color: #0070f3;
        }
        
        @media (max-width: 1200px) {
          .nav-menu {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
        
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: #0070f3;
          color: white;
        }
        
        .btn-outline {
          background: transparent;
          color: #0070f3;
          border: 1px solid #0070f3;
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: transparent;
          color: #666;
          cursor: pointer;
          font-weight: 500;
        }
        
        .logout-btn:hover {
          background: #f8f9fa;
          color: #333;
        }
        
        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            height: auto;
            padding: 10px 20px;
          }
          
          .nav-menu {
            flex-wrap: wrap;
            justify-content: center;
            margin: 10px 0;
          }
          
          .nav-auth {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </nav>
  );
}