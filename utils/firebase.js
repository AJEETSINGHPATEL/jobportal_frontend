// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc6VW8icBvDWdF-CbzWvXqUBOaVRFxmFw",
  authDomain: "portal-31935.firebaseapp.com",
  projectId: "portal-31935",
  storageBucket: "portal-31935.firebasestorage.app",
  messagingSenderId: "1057415297509",
  appId: "1:1057415297509:web:301fed9ea4d3777ac2170c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics };