import { useEffect } from 'react';
import '../styles/output.css';
import '../styles/header-banner.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Chatbot from '../components/ai/Chatbot';
import ConnectionStatus from '../components/ConnectionStatus';
import ErrorBoundary from '../components/ErrorBoundary';

// Wrap the component with auth context
function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <ConnectionStatus />
        <Navigation user={user} />
        <Component {...pageProps} user={user} />
        <Chatbot />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

function MyApp({ Component, pageProps }) {
  // Global error handlers
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      // Prevent the default browser behavior
      event.preventDefault();
    };
    
    // Handle uncaught errors
    const handleError = (event) => {
      console.error('Uncaught Error:', event.error);
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;