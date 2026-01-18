import Link from 'next/link';
import { FaBuilding } from 'react-icons/fa';

export default function EmployerButton({ children, variant = 'primary', size = 'medium', href = '/employer-dashboard' }) {
  const getButtonClass = () => {
    let classes = 'employer-button';
    
    // Variant classes
    switch (variant) {
      case 'outline':
        classes += ' employer-button-outline';
        break;
      case 'secondary':
        classes += ' employer-button-secondary';
        break;
      default:
        classes += ' employer-button-primary';
    }
    
    // Size classes
    switch (size) {
      case 'small':
        classes += ' employer-button-small';
        break;
      case 'large':
        classes += ' employer-button-large';
        break;
      default:
        classes += ' employer-button-medium';
    }
    
    return classes;
  };

  return (
    <Link href={href} className={getButtonClass()}>
      <FaBuilding /> {children || 'For Employers'}
      
      <style jsx>{`
        .employer-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          border-radius: 6px;
        }
        
        .employer-button-primary {
          background: #0070f3;
          color: white;
        }
        
        .employer-button-outline {
          background: transparent;
          color: #0070f3;
          border: 2px solid #0070f3;
        }
        
        .employer-button-secondary {
          background: #f0f2f5;
          color: #333;
        }
        
        .employer-button-small {
          padding: 8px 16px;
          font-size: 0.875rem;
        }
        
        .employer-button-medium {
          padding: 12px 24px;
          font-size: 1rem;
        }
        
        .employer-button-large {
          padding: 16px 32px;
          font-size: 1.125rem;
        }
        
        .employer-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .employer-button-primary:hover {
          background: #0055cc;
        }
        
        .employer-button-outline:hover {
          background: rgba(0, 112, 243, 0.1);
        }
        
        .employer-button-secondary:hover {
          background: #e4e6ea;
        }
      `}</style>
    </Link>
  );
}