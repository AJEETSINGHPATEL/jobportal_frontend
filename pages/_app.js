import '../styles/output.css';
import '../styles/header-banner.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

import Chatbot from '../components/ai/Chatbot';

// Wrap the component with auth context
function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navigation user={user} />
      <Component {...pageProps} user={user} />
      <Chatbot />
      <Footer />
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;