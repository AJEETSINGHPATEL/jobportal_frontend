import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaUser, FaBriefcase, FaChartBar, FaUsers, FaSignOutAlt, FaFileAlt, FaSignInAlt, FaUserPlus, FaPlus, FaBell } from 'react-icons/fa';

export default function Navigation({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          CareerHub
        </Link>
        
        <div className="nav-links">
          <Link href="/" className={router.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link href="/jobs" className={router.pathname === '/jobs' ? 'active' : ''}>Jobs</Link>
          
          {user ? (
            <>
              <Link href={`/dashboard/${user.user_type || 'jobseeker'}`} className={router.pathname.includes('/dashboard') ? 'active' : ''}>
                Dashboard
              </Link>
              <Link href="/profile" className={router.pathname === '/profile' ? 'active' : ''}>Profile</Link>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={router.pathname === '/login' ? 'active' : ''}>Login</Link>
              <Link href="/register" className={router.pathname === '/register' ? 'active' : ''}>Register</Link>
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .navigation {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }
        
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: white;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        
        .nav-links a:hover,
        .nav-links a.active {
          color: white;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .logout-btn {
          background: transparent;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </nav>
  );
}