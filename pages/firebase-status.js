import { useState, useEffect } from 'react';
import { app, auth, db } from '../utils/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function FirebaseStatus() {
  const [status, setStatus] = useState('Checking...');
  const [details, setDetails] = useState({});
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Check if Firebase app is initialized
        if (app) {
          setStatus('Connected');
          setDetails({
            appId: app.options?.appId || 'Not available',
            projectId: app.options?.projectId || 'Not available',
            authDomain: app.options?.authDomain || 'Not available'
          });

          // Test Firestore connection
          try {
            const testCollection = collection(db, 'test');
            const testDoc = await addDoc(testCollection, {
              message: 'Firebase connection test',
              timestamp: new Date().toISOString()
            });
            
            setTestResult(`✅ Test successful! Document ID: ${testDoc.id}`);
            
            // Read the document back
            const querySnapshot = await getDocs(testCollection);
            console.log(`Retrieved ${querySnapshot.size} documents from test collection`);
            
          } catch (testError) {
            setTestResult(`❌ Test failed: ${testError.message}`);
          }
        } else {
          setStatus('Not initialized');
          setDetails({ error: 'Firebase app not found' });
          setTestResult('❌ Firebase not initialized');
        }
      } catch (error) {
        setStatus('Error');
        setDetails({ error: error.message });
        setTestResult(`❌ Error: ${error.message}`);
      }
    };

    checkFirebaseStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Firebase Integration Status</h1>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-lg font-medium text-gray-700">Connection Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'Connected' 
                  ? 'bg-green-100 text-green-800' 
                  : status === 'Error' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {status}
              </span>
            </div>

            {testResult && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Test Result:</h3>
                <p className="text-blue-700">{testResult}</p>
              </div>
            )}

            {Object.keys(details).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuration Details</h2>
                <div className="space-y-3">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="text-gray-900 font-mono text-sm break-all max-w-xs text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Firebase Services Available</h2>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Authentication Service
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Cloud Firestore Database
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Cloud Storage
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Analytics (Browser only)
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Integration Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Chat History Sync</h3>
                  <p className="text-gray-600 text-sm">Chat messages are now synced to Firebase Firestore for persistent storage across devices.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">User Analytics</h3>
                  <p className="text-gray-600 text-sm">User activities and interactions are logged to Firebase for analytics and insights.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Real-time Updates</h3>
                  <p className="text-gray-600 text-sm">Firebase enables real-time data synchronization across all connected clients.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Scalable Infrastructure</h3>
                  <p className="text-gray-600 text-sm">Built on Google's infrastructure for reliable, scalable cloud services.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Back to Home
            </a>
            <a 
              href="/jobs" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}