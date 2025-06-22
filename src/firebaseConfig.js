// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcxjkD_TTg5b6S3XOmZ3PbWMgaPbNK1U0",
  authDomain: "studentmindcare.firebaseapp.com",
  projectId: "studentmindcare",
  storageBucket: "studentmindcare.firebasestorage.app",
  messagingSenderId: "88889265900",
  appId: "1:88889265900:web:530160ca4bd40d28705fc9",
  measurementId: "G-0XRS5VS23C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
export {firebaseConfig};