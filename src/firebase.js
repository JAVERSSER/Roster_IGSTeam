// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCcYDLdMi53cAxQE6uDSq0hRAQYE5L_X0k",
  authDomain: "basiclogin-bc302.firebaseapp.com",
  projectId: "basiclogin-bc302",
  storageBucket: "basiclogin-bc302.appspot.com", // ✅ corrected
  messagingSenderId: "7578565990",
  appId: "1:7578565990:web:37649ccf1c2026d1b9dca7",
  measurementId: "G-BTB3LB0F1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export { app };
