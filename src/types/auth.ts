import { User } from 'firebase/auth'; // Import the Firebase User type

// 1. Define the enriched user type that includes custom MongoDB fields
// This is the shape of the user object that AuthContext returns when logged in.
export interface EnrichedUser extends User {
    username: string;
    // You can add other MongoDB fields here (e.g., role, etc.)
}

// 2. Define the full shape of your AuthContext value
// currentUser is now EnrichedUser when it exists.
export interface AuthContextType {
    currentUser: EnrichedUser | null; 
    loading: boolean;
    error: string | null;
    signUp: (data: { email: string; username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    login: (data: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
    signOut: () => Promise<void>;
}
