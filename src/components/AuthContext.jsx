"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithCustomToken, User as FirebaseUser } from 'firebase/auth';
import { initializeAuth } from '@/lib/firebase'; 
import axios from 'axios';

// NOTE: We assume 'firebaseAdmin' and 'connectDB' helpers are set up in '@/lib'

/**
 * We define the structure here for clarity and to allow type extension.
 * A complete user profile might include MongoDB fields like 'username'
 */
const initialContextValue = {
    currentUser: null,
    loading: true,
    signUp: async () => ({ success: false, message: "Context not yet initialized." }), 
    login: async () => ({ success: false, message: "Context not yet initialized." }), 
    signOut: async () => {},
    error: null,
};

// 1. Define the Context
const AuthContext = createContext(initialContextValue);

// 2. Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// 3. Provider Component
export const AuthProvider = ({ children }) => {
    // The current user state can be FirebaseUser | EnrichedUser | null
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(null);
    const [error, setError] = useState(null);

    // --- Core Initialization ---
    useEffect(() => {
        const init = async () => {
            const initializedAuth = await initializeAuth(); 
            if (initializedAuth) {
                setAuth(initializedAuth);
            }
        };
        init();
    }, []); 

    // --- Helper to fetch and merge user profile ---
    const enrichUserProfile = useCallback(async (firebaseUser) => {
        if (!firebaseUser) return null;

        try {
            // Get the user's ID token to securely authenticate the profile API call
            const token = await firebaseUser.getIdToken();
            console.log("🔥 Firebase Token being sent:", token);
            
            const response = await axios.get('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Assuming the API returns the enriched user data
            if (response.status === 200 && response.data.user) {
                // Merge Firebase data with custom profile data (e.g., username)
                return { ...firebaseUser, ...response.data.user };
            }
            return firebaseUser; // Return basic user if profile fetch fails
        } catch (err) {
            console.error("Failed to enrich user profile:", err);
            // Optionally set an error state here
            return firebaseUser; // Return basic user on error
        }
    }, []);

    // --- Listener Setup ---
    useEffect(() => {
        let unsubscribe = () => {};
        if (auth) {
            // Set up the state listener ONLY when 'auth' is initialized
            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // Fetch the full profile (e.g., username) after successful login
                    const enrichedUser = await enrichUserProfile(user);
                    setCurrentUser(enrichedUser);
                } else {
                    setCurrentUser(null);
                }
                setLoading(false);
            }, (err) => {
                console.error("Auth state change error:", err);
                setError("An authentication error occurred.");
                setLoading(false);
            });
        } 
        
        return () => {
            unsubscribe();
        };
    }, [auth, enrichUserProfile]);

    // --- Auth Actions (Sign Up, Login, Sign Out remain largely the same) ---

    // The sign-up and login functions will rely on the onAuthStateChanged listener above
    // to call enrichUserProfile and update the state upon successful token sign-in.
    
    // 🔥 SIGN UP: Registers user in MongoDB and signs into Firebase with Custom Token
    const signUp = useCallback(async ({ email, username, password }) => {
        setError(null);
        setLoading(true); 
        
        try {
            if (!auth) throw new Error("Authentication not initialized.");
            
            const response = await axios.post('/api/auth/signup', { email, username, password }); // Assuming you use a specific signup route

            if (response.status === 201 && response.data.customToken) {
                // The following call triggers the onAuthStateChanged listener above
                const userCredential = await signInWithCustomToken(auth, response.data.customToken);
                
                return { success: true, user: userCredential.user };
            }
            
            return { success: false, message: response.data.message || "Registration failed on server." };

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred during sign up.";
            setError(errorMessage);
            setLoading(false); 
            return { success: false, message: errorMessage };
        }
    }, [auth]);

    // 🔥 LOGIN: Verifies credentials against MongoDB and signs into Firebase with Custom Token
    const login = useCallback(async ({ email, password }) => {
        setError(null);
        setLoading(true); 
        
        try {
            if (!auth) throw new Error("Authentication not initialized.");
            
            // 1. Call the Login API route
            const response = await axios.post('/api/auth/login', { email, password }); 

            if (response.status === 200 && response.data.customToken) {
                // The following call triggers the onAuthStateChanged listener above
                const userCredential = await signInWithCustomToken(auth, response.data.customToken);
                
                return { success: true, user: userCredential.user };
            }
            
            return { success: false, message: response.data.message || "Login failed. Check credentials." };

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred during login.";
            setError(errorMessage);
            setLoading(false);
            return { success: false, message: errorMessage };
        }
    }, [auth]);

    // 🔥 SIGN OUT: Ends the Firebase session
    const signOut = useCallback(async () => {
        if (auth) {
            await firebaseSignOut(auth);
            // onAuthStateChanged listener updates currentUser to null
        }
    }, [auth]);

    // --- Context Value ---
    const value = {
        currentUser,
        loading,
        error,
        signUp,
        login,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Render children once loading is complete */}
            {!loading && children}
            {loading && (
                <div className="flex justify-center items-center min-h-screen text-lg">
                    Loading authentication...
                </div>
            )}
        </AuthContext.Provider>
    );
};
