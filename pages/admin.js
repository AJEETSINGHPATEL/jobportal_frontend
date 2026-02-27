import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the admin dashboard
    router.push('/admin-dashboard');
  }, [router]);

  return (
    <div className="redirect-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Redirecting to Admin Dashboard...</p>
      </div>
      
      <style jsx>{`
        .redirect-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f7fa;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #dc3545;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        p {
          color: #666;
          font-size: 1.1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
