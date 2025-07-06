// Import Firebase core and required services
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ Import getAuth

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcxjkD_TTg5b6S3XOmZ3PbWMgaPbNK1U0",
  authDomain: "studentmindcare.firebaseapp.com",
  projectId: "studentmindcare",
  storageBucket: "studentmindcare.firebasestorage.app",
  messagingSenderId: "88889265900",
  appId: "1:88889265900:web:530160ca4bd40d28705fc9",
  measurementId: "G-0XRS5VS23C"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ✅ Initialize auth

// ✅ Export what you need
export { app, analytics, auth, firebaseConfig };
