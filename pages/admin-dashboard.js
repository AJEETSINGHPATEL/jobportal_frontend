import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import Link from 'next/link';
import { FaUsers, FaBuilding, FaBan, FaCheck, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      router.push('/'); // Redirect non-admin users
      return;
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch real data from admin API
      const response = await api.getAdminUsers();
      const allUsers = response.users || response;
      
      // Filter users by role
      const jobSeekers = allUsers.filter(user => user.role === 'job_seeker');
      const employers = allUsers.filter(user => user.role === 'employer');
      
      setUsers(jobSeekers);
      setEmployers(employers);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching user data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId);
        // Refresh the data after successful deletion
        fetchData();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      // Find the user to get current status
      const user = [...users, ...employers].find(u => u.id === userId);
      if (!user) return;
      
      // Call the real API to update status
      await api.updateUserStatus(userId, !user.is_active);
      
      // Refresh the data after successful update
      fetchData();
      alert(`User status updated successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error updating user status: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-profile">
            <div className="admin-avatar">
              <span>A</span>
            </div>
            <div className="admin-info">
              <h3>Admin User</h3>
              <p>System Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Job Seekers
          </button>
          <button 
            className={`tab ${activeTab === 'employers' ? 'active' : ''}`}
            onClick={() => setActiveTab('employers')}
          >
            <FaBuilding /> Employers
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>Job Seekers Management</h2>
              <p>Manage all job seeker accounts</p>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="icon-button"
                            onClick={() => handleToggleUserStatus(user.id)}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? <FaBan /> : <FaCheck />}
                          </button>
                          <button 
                            className="icon-button"
                            onClick={() => router.push(`/profile/${user.id}`)}
                            title="View Profile"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="icon-button danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'employers' && (
          <div className="employers-section">
            <div className="section-header">
              <h2>Employers Management</h2>
              <p>Manage all employer accounts</p>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Jobs Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map(employer => (
                    <tr key={employer.id}>
                      <td>{employer.company || 'N/A'}</td>
                      <td>{employer.full_name}</td>
                      <td>{employer.email}</td>
                      <td>
                        <span className={`status-badge ${employer.is_active ? 'active' : 'inactive'}`}>
                          {employer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{employer.jobs_posted || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="icon-button"
                            onClick={() => handleToggleUserStatus(employer.id)}
                            title={employer.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {employer.is_active ? <FaBan /> : <FaCheck />}
                          </button>
                          <button 
                            className="icon-button"
                            onClick={() => router.push(`/profile/${employer.id}`)}
                            title="View Profile"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="icon-button danger"
                            onClick={() => handleDeleteUser(employer.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }

        .admin-header {
          background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%);
          color: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .admin-info h3 {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
        }

        .admin-info p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        /* Tabs */
        .tabs-container {
          max-width: 1200px;
          margin: 0 auto 2rem;
        }

        .tabs {
          display: flex;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .tab {
          flex: 1;
          padding: 15px 20px;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: #dc3545;
          color: white;
        }

        .tab:not(.active):hover {
          background: #f8f9fa;
        }

        /* Main Content */
        .admin-main {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .section-header h2 {
          margin: 0 0 10px 0;
          font-size: 1.5rem;
          color: #333;
        }

        .section-header p {
          margin: 0;
          color: #666;
        }

        /* Table Styles */
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 15px 20px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid #eee;
        }

        .data-table td {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }

        .data-table tr:last-child td {
          border-bottom: none;
        }

        .data-table tr:hover td {
          background: #f8f9fa;
        }

        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .active {
          background: #d4edda;
          color: #155724;
        }

        .inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .icon-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0f2f5;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-button:hover {
          background: #0070f3;
          color: white;
        }

        .icon-button.danger:hover {
          background: #dc3545;
        }

        /* Loading Spinner */
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #dc3545;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .tabs {
            flex-direction: column;
          }
          
          .data-table {
            display: block;
            overflow-x: auto;
          }
          
          .admin-container {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}