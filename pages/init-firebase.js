import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { initializeFirebaseData } from '../utils/initFirebaseData';

export default function FirebaseInitPage() {
  const router = useRouter();
  const [status, setStatus] = useState('ready');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleInitialize = async () => {
    setStatus('initializing');
    setLogs([]);
    addLog('Starting Firebase database initialization...');

    try {
      addLog('Connecting to Firebase...');
      const success = await initializeFirebaseData();
      
      if (success) {
        addLog('✅ Firebase database initialized successfully!');
        setStatus('success');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        addLog('❌ Firebase initialization failed');
        setStatus('error');
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Firebase Database Initialization
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">What This Does</h2>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Creates job listings in Firebase Firestore</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Sets up employer contact information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Configures chat message storage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Enables real-time data synchronization</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Initialization Status</h2>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <span className="text-lg font-medium text-gray-700">Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'ready' ? 'bg-blue-100 text-blue-800' :
                  status === 'initializing' ? 'bg-yellow-100 text-yellow-800' :
                  status === 'success' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {status === 'ready' && 'Ready to Initialize'}
                  {status === 'initializing' && 'Initializing...'}
                  {status === 'success' && 'Success!'}
                  {status === 'error' && 'Error Occurred'}
                </span>
              </div>
            </div>

            {logs.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Initialization Log</h2>
                <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              {status === 'ready' && (
                <button
                  onClick={handleInitialize}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Initialize Firebase Database
                </button>
              )}
              
              {status === 'success' && (
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Go to Homepage
                </button>
              )}
              
              {(status === 'error' || status === 'success') && (
                <button
                  onClick={() => {
                    setStatus('ready');
                    setLogs([]);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• This will create sample data for demonstration purposes</li>
                <li>• Existing data will not be overwritten</li>
                <li>• You can run this multiple times safely</li>
                <li>• The chatbot will use this data for job searches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}