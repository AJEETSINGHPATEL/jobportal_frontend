import '../styles/output.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';

import Chatbot from '../components/ai/Chatbot';

// Initialize Firebase
import '../utils/firebase';

const ImmersiveBackground = dynamic(
  () => import('../components/ImmersiveBackground'),
  { ssr: false }
);

// Wrap the component with auth context
function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 0 }}>
      <ImmersiveBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navigation user={user} />
        <Component {...pageProps} user={user} />
        <Chatbot />
        <Footer />
      </div>
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