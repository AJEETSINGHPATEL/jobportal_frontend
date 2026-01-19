import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: true,
    checking: false
  });

  const checkConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const status = await api.checkConnection();
      setConnectionStatus({
        connected: status.connected,
        checking: false,
        lastChecked: status.timestamp,
        error: status.error
      });
    } catch (error) {
      setConnectionStatus({
        connected: false,
        checking: false,
        lastChecked: new Date().toISOString(),
        error: error.message
      });
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();
    
    // Periodic checks every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (connectionStatus.connected) {
    return null; // Don't show anything when connected
  }

  return (
    <div className="connection-status-bar">
      <div className="connection-warning">
        <span className="warning-icon">⚠️</span>
        <span className="warning-text">
          {connectionStatus.checking 
            ? 'Checking connection...' 
            : 'Connection issues detected. Some features may not work properly.'
          }
        </span>
        <button 
          onClick={checkConnection}
          disabled={connectionStatus.checking}
          className="retry-button"
        >
          {connectionStatus.checking ? 'Checking...' : 'Retry'}
        </button>
      </div>
      
      <style jsx>{`
        .connection-status-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: #fff3cd;
          border-bottom: 1px solid #ffeaa7;
          padding: 8px 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .connection-warning {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .warning-icon {
          font-size: 18px;
        }
        
        .warning-text {
          flex: 1;
          color: #856404;
          font-size: 14px;
          font-weight: 500;
        }
        
        .retry-button {
          background: #856404;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .retry-button:hover:not(:disabled) {
          background: #6d5403;
        }
        
        .retry-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .connection-status-bar {
            padding: 6px 12px;
          }
          
          .connection-warning {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          
          .warning-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}