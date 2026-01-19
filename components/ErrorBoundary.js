import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Optional: Report to error monitoring service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Determine error type for better messaging
      const error = this.state.error;
      let errorTitle = 'Something went wrong';
      let errorDescription = 'An unexpected error occurred. Please try again.';
      let showTechnicalDetails = false;

      // Network/Connection errors
      if (error.message && (
        error.message.includes('Network error') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Connection')
      )) {
        errorTitle = 'Connection Issue';
        errorDescription = 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.';
        showTechnicalDetails = true;
      }
      // Authentication errors
      else if (error.message && (
        error.message.includes('Unauthorized') ||
        error.message.includes('Authentication') ||
        error.message.includes('Session expired')
      )) {
        errorTitle = 'Authentication Error';
        errorDescription = 'Your session may have expired. Please try logging in again.';
      }
      // Validation errors
      else if (error.message && error.message.includes('Validation')) {
        errorTitle = 'Validation Error';
        errorDescription = 'There was a problem with the information provided. Please check your inputs and try again.';
      }

      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">{errorTitle}</h2>
            <p className="error-description">{errorDescription}</p>
            
            {showTechnicalDetails && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <div className="error-info">
                  <p><strong>Error:</strong> {error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="error-stack">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                onClick={this.handleRetry}
                className="retry-button"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="refresh-button"
              >
                Refresh Page
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f8f9fa;
              padding: 20px;
            }
            
            .error-container {
              max-width: 500px;
              width: 100%;
              background: white;
              border-radius: 12px;
              padding: 2.5rem;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
            }
            
            .error-icon {
              font-size: 4rem;
              margin-bottom: 1.5rem;
            }
            
            .error-title {
              color: #dc3545;
              margin-bottom: 1rem;
              font-size: 1.75rem;
              font-weight: 600;
            }
            
            .error-description {
              color: #6c757d;
              margin-bottom: 1.5rem;
              line-height: 1.6;
              font-size: 1.1rem;
            }
            
            .error-details {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 1rem;
              margin: 1.5rem 0;
              text-align: left;
            }
            
            .error-details summary {
              cursor: pointer;
              font-weight: 500;
              color: #495057;
              margin-bottom: 0.5rem;
            }
            
            .error-info {
              margin-top: 0.5rem;
            }
            
            .error-stack {
              background: #2d3748;
              color: #e2e8f0;
              padding: 1rem;
              border-radius: 4px;
              font-size: 0.85rem;
              overflow-x: auto;
              max-height: 200px;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-top: 1.5rem;
            }
            
            .retry-button, .refresh-button {
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
              border: none;
            }
            
            .retry-button {
              background: #007bff;
              color: white;
            }
            
            .retry-button:hover {
              background: #0056b3;
              transform: translateY(-2px);
            }
            
            .refresh-button {
              background: #6c757d;
              color: white;
            }
            
            .refresh-button:hover {
              background: #545b62;
              transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
              .error-container {
                padding: 1.5rem;
              }
              
              .error-actions {
                flex-direction: column;
              }
              
              .error-icon {
                font-size: 3rem;
              }
              
              .error-title {
                font-size: 1.5rem;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;