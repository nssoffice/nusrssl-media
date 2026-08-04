import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const env = (import.meta as any).env || {};

// Firebase configuration using environment variables or fallback values
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForNUSRSSL2026App",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "nusrssl-samabay.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "nusrssl-samabay",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "nusrssl-samabay.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: env.VITE_FIREBASE_APP_ID || "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
