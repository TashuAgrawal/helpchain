// src/lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- Load Firebase config from environment variables ---
// NOTE: These must be prefixed with NEXT_PUBLIC_ in your .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Global references for initialization
let firebaseApp;
let auth;
let db;
let storage;

/**
 * Initializes Firebase services if they haven't been initialized already.
 * This function is used by the AuthContext to get the 'auth' object.
 * @returns {import('firebase/auth').Auth | null} The Firebase Auth instance.
 */
export const initializeAuth = () => {
  try {
    // Initialize Firebase App only once
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }

    // Get service instances
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);

    // No need for signInAnonymously here; AuthContext handles sign-in flow
    
    return auth;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // You might want to throw or return null to signal failure
    return null; 
  }
};


// Export services safely for direct use (e.g., db for firestore operations)
export { auth, db, storage };