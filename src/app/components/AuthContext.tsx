"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithCustomToken,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";
import { initializeAuth } from "@/app/lib/firebase";
import axios from "axios";

// ---------------------------------------------------
// Types
// ---------------------------------------------------

interface EnrichedUser extends FirebaseUser {
  username?: string;
  [key: string]: any;
}

interface AuthContextType {
  currentUser: EnrichedUser | null;
  loading: boolean;
  error: string | null;
  signUp: (params: { email: string; username: string; password: string }) => Promise<{
    success: boolean;
    message?: string;
  }>;
  login: (params: { email: string; password: string }) => Promise<{
    success: boolean;
    message?: string;
  }>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------
// Default Context Value
// ---------------------------------------------------

const initialContextValue: AuthContextType = {
  currentUser: null,
  loading: true,
  error: null,
  signUp: async () => ({ success: false, message: "Auth not initialized." }),
  login: async () => ({ success: false, message: "Auth not initialized." }),
  signOut: async () => {},
};

// ---------------------------------------------------
// Create Context and Hook
// ---------------------------------------------------

const AuthContext = createContext<AuthContextType>(initialContextValue);
export const useAuth = () => useContext(AuthContext);

// ---------------------------------------------------
// AuthProvider Component
// ---------------------------------------------------

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [currentUser, setCurrentUser] = useState<EnrichedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------
  // Initialize Firebase Auth once
  // ---------------------------------------------------

  useEffect(() => {
    const initAuth = async () => {
      try {
        const initializedAuth = await initializeAuth();
        setAuth(initializedAuth);
      } catch (err) {
        console.error("Failed to initialize Firebase auth:", err);
        setError("Failed to initialize authentication.");
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // ---------------------------------------------------
  // Helper: Fetch and merge MongoDB profile
  // ---------------------------------------------------

  const enrichUserProfile = useCallback(
    async (firebaseUser: FirebaseUser): Promise<EnrichedUser | null> => {
      if (!firebaseUser) return null;

      try {
        const token = await firebaseUser.getIdToken();
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.user) {
          return { ...firebaseUser, ...response.data.user };
        }
        return firebaseUser;
      } catch (err) {
        console.error("Failed to enrich user profile:", err);
        return firebaseUser;
      }
    },
    []
  );

  // ---------------------------------------------------
  // Listen for auth state changes
  // ---------------------------------------------------

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          const enrichedUser = await enrichUserProfile(user);
          setCurrentUser(enrichedUser);
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Auth state change error:", err);
        setError("An authentication error occurred.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth, enrichUserProfile]);

  // ---------------------------------------------------
  // SIGN UP
  // ---------------------------------------------------

  const signUp = useCallback(
    async ({
      email,
      username,
      password,
    }: {
      email: string;
      username: string;
      password: string;
    }) => {
      setError(null);
      setLoading(true);

      try {
        if (!auth) throw new Error("Authentication not initialized.");

        const response = await axios.post("/api/auth/signup", {
          email,
          username,
          password,
        });

        if (response.status === 201 && response.data.customToken) {
          await signInWithCustomToken(auth, response.data.customToken);
          return { success: true };
        }

        return {
          success: false,
          message: response.data.message || "Registration failed.",
        };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred during sign up.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  // ---------------------------------------------------
  // LOGIN
  // ---------------------------------------------------

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setError(null);
      setLoading(true);

      try {
        if (!auth) throw new Error("Authentication not initialized.");

        const response = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (response.status === 200 && response.data.customToken) {
          await signInWithCustomToken(auth, response.data.customToken);
          return { success: true };
        }

        return {
          success: false,
          message: response.data.message || "Login failed. Check credentials.",
        };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unknown error occurred during login.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  // ---------------------------------------------------
  // SIGN OUT
  // ---------------------------------------------------

  const signOut = useCallback(async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
        setCurrentUser(null);
      } catch (err) {
        console.error("Error signing out:", err);
        setError("Failed to sign out.");
      }
    }
  }, [auth]);

  // ---------------------------------------------------
  // Context Value
  // ---------------------------------------------------

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    signUp,
    login,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen text-lg">
          Loading authentication...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
