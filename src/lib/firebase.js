import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const getAuthDomain = () => {
  if (
    typeof window !== "undefined" &&
    window.location.hostname &&
    window.location.hostname.includes("vercel.app")
  ) {
    return window.location.hostname;
  }
  return import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lov-portal-1300f.firebaseapp.com";
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBizLB1pHdsnYUKCzLeEtW_GOCGfpzTKnI",
  authDomain: getAuthDomain(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lov-portal-1300f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lov-portal-1300f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "991992807622",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:991992807622:web:4e0d076f112334d68797c7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TWFREX6KQP",
};

// Initialize Firebase only once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
