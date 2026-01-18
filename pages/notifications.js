import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch notifications from your API
    // For now, we'll use mock data
    const mockNotifications = [
      {
        id: '1',
        title: 'Job Application Update',
        message: 'Your application for Senior Developer at Tech Corp has been reviewed.',
        type: 'application_status',
        isRead: false,
        createdAt: '2023-03-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'New Job Alert',
        message: 'We found a new job matching your profile: Frontend Engineer at StartupXYZ',
        type: 'job_alert',
        isRead: false,
        createdAt: '2023-03-14T14:15:00Z'
      },
      {
        id: '3',
        title: 'Profile Viewed',
        message: 'Your profile was viewed by a recruiter from Innovate Inc',
        type: 'profile_viewed',
        isRead: true,
        createdAt: '2023-03-13T09:45:00Z'
      },
      {
        id: '4',
        title: 'Interview Scheduled',
        message: 'Interview scheduled for Marketing Manager position at Brand Co',
        type: 'application_status',
        isRead: true,
        createdAt: '2023-03-12T16:20:00Z'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Notifications</h1>
        <div className="actions">
          <span>{unreadCount} unread</span>
          <button onClick={markAllAsRead}>Mark All as Read</button>
        </div>
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="notification-header">
                <h3>{notification.title}</h3>
                <span className="time">{formatTime(notification.createdAt)}</span>
              </div>
              <p>{notification.message}</p>
              <div className="notification-footer">
                <span className={`type ${notification.type}`}>
                  {notification.type.replace('_', ' ')}
                </span>
                {!notification.isRead && (
                  <button onClick={() => markAsRead(notification.id)}>
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .actions button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 3px;
          cursor: pointer;
        }
        
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .notification-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .notification-card.unread {
          border-left: 4px solid #0070f3;
          background: #f9f9ff;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .notification-header h3 {
          margin: 0;
          color: #333;
        }
        
        .time {
          color: #666;
          font-size: 0.875rem;
        }
        
        .notification-card p {
          margin: 0.5rem 0 1rem;
          color: #555;
        }
        
        .notification-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .type {
          background: #eee;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        
        .type.job_alert {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .type.application_status {
          background: #e8f5e9;
          color: #388e3c;
        }
        
        .type.profile_viewed {
          background: #fff3e0;
          color: #f57c00;
        }
        
        .notification-footer button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}