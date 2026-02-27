import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null); // Track token in state
  const [loading, setLoading] = useState(true);

  // Function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Function to set token in both state and localStorage
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem('token');
      setTokenState(null);
    }
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    const initializeAuth = async () => {
      const token = getToken();
      setTokenState(token); // Set the token in state
      
      if (token) {
        try {
          // First, try to get user info from the backend API
          try {
            const userData = await api.getCurrentUser();
            // Set user data from the API response
            setUser(userData);
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (apiError) {
            // If API call fails, try to get user from localStorage
            console.error('Error getting user from API:', apiError);
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (Object.keys(userData).length > 0) {
              setUser(userData);
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          // Clear invalid data if there's an error
          setToken(null);
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData, authToken) => {
    setToken(authToken);
    // Store the complete user object
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Function to update user profile picture
  const updateProfilePicture = (pictureUrl) => {
    if (user) {
      const updatedUser = { ...user, profilePicture: pictureUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token, // Now token is reactive
    getToken,
    setToken,
    login,
    logout,
    updateProfilePicture, // Add the function to update profile picture
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};