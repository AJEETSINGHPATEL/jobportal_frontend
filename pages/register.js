import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    role: 'job_seeker', // Default to job seeker
    company: '', // For employers
    resume: null
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

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user data object with correct field names
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: formData.role,
        // Note: company field is not in the UserCreate model, so we won't send it
        // In a real implementation, you might store company info in a separate collection
      };
      
      console.log('Sending user data:', userData);
      
      // Submit registration data using our api utility
      const response = await api.signup(userData);
      
      console.log('Registration response:', response);
      
      // Try to login the user automatically after successful registration
      try {
        const loginResponse = await api.login({
          email: formData.email,
          password: formData.password
        });
        
        // Use auth context to handle login
        login(loginResponse.user, loginResponse.token);
        
        // Show success message and redirect based on role
        alert('Registration successful! You are now logged in.');
        
        if (loginResponse.user.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (loginResponse.user.role === 'employer') {
          router.push('/employer-dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch (loginErr) {
        console.error('Auto-login after registration failed:', loginErr);
        // If auto-login fails, redirect to login page
        alert('Registration successful! Please login with your credentials.');
        router.push('/login');
      }
    } catch (err) {
      console.error('Registration error details:', err);
      if (err.status) {
        // Handle specific error responses from the server
        let errorMessage = err.response?.detail || `Registration failed: ${err.message}`;
        // Handle if error detail is an object
        if (typeof errorMessage === 'object') {
          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage[0]?.msg || 'Registration failed';
          } else {
            errorMessage = errorMessage.msg || JSON.stringify(errorMessage);
          }
        }
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check if the backend server is running on port 8002.');
      } else {
        setError(`Registration failed: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main className="main">
        <div className="register-container">
          <div className="register-header">
            <div className="header-image">
              <div className="green-boy"></div>
            </div>
            <div className="header-content">
              <h2>On registering, you can</h2>
              <ul>
                <li>Build your profile and let recruiters find you</li>
                <li>Get job postings delivered right to your email</li>
                <li>Find a job and grow your career</li>
              </ul>
            </div>
          </div>
          
          <div className="register-form-section">
            <h1>Find a job & grow your career</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Id</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <p className="help-text">We'll send you relevant jobs in your mail</p>
                </div>
              </div>
              
              <div className="form-row">
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
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mobile">Mobile</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <p className="help-text">Recruiters will call you on this number</p>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="role"
                        value="job_seeker"
                        checked={formData.role === 'job_seeker'}
                        onChange={handleChange}
                      />
                      <span className="radio-text">
                        <strong>Job Seeker</strong>
                        <span>Looking for job opportunities</span>
                      </span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="role"
                        value="employer"
                        checked={formData.role === 'employer'}
                        onChange={handleChange}
                      />
                      <span className="radio-text">
                        <strong>Employer</strong>
                        <span>Looking to hire candidates</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              {formData.role === 'employer' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
              
              {formData.role === 'job_seeker' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="resume">Resume</label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      className="form-input"
                      accept=".doc,.docx,.pdf,.rtf"
                    />
                    <p className="help-text">Upload Resume DOC, DOCx, PDF, RTF | Max: 2MB</p>
                    <p className="help-text">Recruiters give first preference to candidates who have a resume</p>
                  </div>
                </div>
              )}
              
              <div className="form-row checkbox-row">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I have read and agree to the Terms and Conditions, Privacy Policy and Community Guidelines of Naukri.com
                </label>
              </div>
              
              <button type="submit" disabled={loading} className="btn-register">
                {loading ? 'Registering...' : 'Register Now'}
              </button>
              
              <div className="login-link">
                Already registered? <a href="/login">Login</a>
              </div>
            </form>
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
        
        .register-container {
          max-width: 1200px;
          margin: 2rem auto;
          display: flex;
          gap: 2rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .register-header {
          flex: 1;
          background: linear-gradient(135deg, #0070f3 0%, #0055cc 100%);
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .header-image {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .green-boy {
          width: 200px;
          height: 200px;
          background: #4caf50;
          border-radius: 50%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: white;
        }
        
        .header-content h2 {
          margin-top: 0;
          font-size: 1.5rem;
        }
        
        .header-content ul {
          list-style: none;
          padding: 0;
        }
        
        .header-content li {
          margin-bottom: 1rem;
          position: relative;
          padding-left: 1.5rem;
        }
        
        .header-content li:before {
          content: "✓";
          color: #4caf50;
          position: absolute;
          left: 0;
          top: 0;
        }
        
        .register-form-section {
          flex: 1;
          padding: 2rem;
        }
        
        .register-form-section h1 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }
        
        .error {
          color: #ff4d4d;
          text-align: center;
          margin-bottom: 1rem;
          padding: 10px;
          background: #ffe6e6;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .form-row {
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
        
        .help-text {
          font-size: 0.875rem;
          color: #666;
          margin: 0.25rem 0 0;
        }
        
        .radio-group {
          display: flex;
          gap: 1rem;
        }
        
        .radio-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .radio-label input[type="radio"] {
          margin-top: 0.25rem;
        }
        
        .radio-text {
          display: flex;
          flex-direction: column;
        }
        
        .radio-text strong {
          margin-bottom: 0.25rem;
        }
        
        .radio-text span {
          font-size: 0.875rem;
          color: #666;
        }
        
        .checkbox-row {
          margin: 2rem 0;
        }
        
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .checkbox-label input[type="checkbox"] {
          margin-top: 0.25rem;
        }
        
        .btn-register {
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
        
        .btn-register:disabled {
          background: #ccc;
        }
        
        .login-link {
          text-align: center;
          color: #666;
        }
        
        .login-link a {
          color: #0070f3;
          text-decoration: none;
        }
        
        @media (max-width: 768px) {
          .register-container {
            flex-direction: column;
          }
          
          .radio-group {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}