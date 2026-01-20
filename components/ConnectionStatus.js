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
      console.error('Connection check failed:', error);
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

  // Show connection status indicator regardless of connection status
  // This allows users to see the status and retry if needed
  const statusClass = connectionStatus.connected ? 'connected' : 'disconnected';

  return (
    <div className={`connection-status-bar ${statusClass}`}>
      <div className="connection-info">
        <span className="status-icon">
          {connectionStatus.checking ? '🔄' : 
           connectionStatus.connected ? '✅' : '⚠️'}
        </span>
        <span className="status-text">
          {connectionStatus.checking 
            ? 'Checking connection...' 
            : connectionStatus.connected 
              ? 'Connected to job portal service'
              : 'Connection issues detected. Some features may not work properly.'
          }
        </span>
        <button 
          onClick={checkConnection}
          disabled={connectionStatus.checking}
          className="refresh-button"
        >
          {connectionStatus.checking ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      <style jsx>{`
        .connection-status-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          border-bottom: 1px solid;
          padding: 8px 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .connection-status-bar.connected {
          background: #d4edda;
          border-color: #c3e6cb;
        }
        
        .connection-status-bar.disconnected {
          background: #fff3cd;
          border-color: #ffeaa7;
        }
        
        .connection-info {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .status-icon {
          font-size: 18px;
        }
        
        .status-text {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }
        
        .connection-status-bar.connected .status-text {
          color: #155724;
        }
        
        .connection-status-bar.disconnected .status-text {
          color: #856404;
        }
        
        .refresh-button {
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .connection-status-bar.connected .refresh-button {
          background: #28a745;
          color: white;
        }
        
        .connection-status-bar.disconnected .refresh-button {
          background: #856404;
          color: white;
        }
        
        .refresh-button:hover:not(:disabled) {
          opacity: 0.9;
          transform: scale(1.05);
        }
        
        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .connection-status-bar {
            padding: 6px 12px;
          }
          
          .connection-info {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          
          .status-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}