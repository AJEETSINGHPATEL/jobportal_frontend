import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// User operations
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Chat operations
export const saveChatMessage = async (messageData) => {
  try {
    const chatRef = collection(db, 'chat_messages');
    const docRef = await addDoc(chatRef, {
      ...messageData,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (userId, limitCount = 50) => {
  try {
    const chatRef = collection(db, 'chat_messages');
    const q = query(
      chatRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

// Job operations
export const saveJob = async (jobData) => {
  try {
    const jobsRef = collection(db, 'jobs');
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...jobData };
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

export const getJobs = async (filters = {}) => {
  try {
    const jobsRef = collection(db, 'jobs');
    let q = query(jobsRef);
    
    // Apply filters if provided
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.location) {
      q = query(q, where('location', '==', filters.location));
    }
    if (filters.company) {
      q = query(q, where('company', '==', filters.company));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    return jobs;
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

// Application operations
export const saveApplication = async (applicationData) => {
  try {
    const applicationsRef = collection(db, 'applications');
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...applicationData };
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

export const getUserApplications = async (userId) => {
  try {
    const applicationsRef = collection(db, 'applications');
    const q = query(
      applicationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    
    return applications;
  } catch (error) {
    console.error('Error getting user applications:', error);
    throw error;
  }
};

// Analytics operations
export const logUserActivity = async (activityData) => {
  try {
    const analyticsRef = collection(db, 'user_activities');
    const docRef = await addDoc(analyticsRef, {
      ...activityData,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, ...activityData };
  } catch (error) {
    console.error('Error logging user activity:', error);
    throw error;
  }
};

export const getAnalyticsData = async (userId, days = 30) => {
  try {
    const analyticsRef = collection(db, 'user_activities');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const q = query(
      analyticsRef,
      where('userId', '==', userId),
      where('timestamp', '>=', cutoffDate),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    return activities;
  } catch (error) {
    console.error('Error getting analytics data:', error);
    throw error;
  }
};