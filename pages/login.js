import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Submit login credentials using our api utility
      const response = await api.login({
        email: formData.email,
        password: formData.password
      });

      // Use auth context to handle login
      login(response.user, response.token);
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        router.push('/admin-dashboard');
      } else if (response.user.role === 'employer') {
        router.push('/employer-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error details:', err);
      if (err.response) {
        let errorMessage = err.response.detail || 'Invalid email or password';
        // Handle if error detail is an object
        if (typeof errorMessage === 'object') {
          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage[0]?.msg || 'Login failed';
          } else {
            errorMessage = errorMessage.msg || JSON.stringify(errorMessage);
          }
        }
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check if the backend server is running on port 8002.');
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main className="main">
        <div className="login-container">
          <div className="login-section">
            <div className="login-form-container">
              <h1>Login</h1>
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email ID / Username</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-options">
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" disabled={loading} className="btn-login">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="divider">
                  <span>or</span>
                </div>
                <button type="button" className="btn-google">
                  <span className="google-icon">G</span>
                  Sign in with Google
                </button>
              </form>
            </div>
          </div>
          
          <div className="register-section">
            <div className="register-content">
              <h2>New to AI Job Portal?</h2>
              <ul className="benefits-list">
                <li>One click apply using naukri profile.</li>
                <li>Get relevant job recommendations.</li>
                <li>Showcase profile to top companies and consultants.</li>
                <li>Know application status on applied jobs.</li>
              </ul>
              <a href="/register" className="btn-register">Register Now</a>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .main {
          flex: 1;
          padding: 2rem 5%;
          background: #f5f5f5;
          min-height: calc(100vh - 200px);
        }
        
        .login-container {
          max-width: 1000px;
          margin: 2rem auto;
          display: flex;
          gap: 2rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .login-section {
          flex: 1;
          padding: 2rem;
        }
        
        .register-section {
          flex: 1;
          background: linear-gradient(135deg, #0070f3 0%, #0055cc 100%);
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .login-form-container h1 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }
        
        .error {
          color: #ff4d4d;
          text-align: center;
          margin-bottom: 1rem;
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
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .form-options {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }
        
        .forgot-password {
          color: #0070f3;
          text-decoration: none;
          font-size: 0.875rem;
        }
        
        .btn-login {
          width: 100%;
          padding: 0.75rem;
          background: #ff9900;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        
        .btn-login:disabled {
          background: #ccc;
        }
        
        .divider {
          text-align: center;
          position: relative;
          margin: 1.5rem 0;
        }
        
        .divider span {
          background: white;
          padding: 0 1rem;
          color: #666;
          position: relative;
          z-index: 1;
        }
        
        .divider:before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #ddd;
          z-index: 0;
        }
        
        .btn-google {
          width: 100%;
          padding: 0.75rem;
          background: white;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .google-icon {
          background: #4285f4;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .register-content h2 {
          margin-top: 0;
          font-size: 1.5rem;
        }
        
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }
        
        .benefits-list li {
          margin-bottom: 1rem;
          position: relative;
          padding-left: 1.5rem;
        }
        
        .benefits-list li:before {
          content: "✓";
          color: #4caf50;
          position: absolute;
          left: 0;
          top: 0;
        }
        
        .btn-register {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: white;
          color: #0070f3;
          border: 2px solid white;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
        }
        
        .btn-register:hover {
          background: transparent;
          color: white;
        }
        
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}