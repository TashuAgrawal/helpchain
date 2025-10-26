import * as admin from 'firebase-admin';

// Function to initialize the Firebase Admin SDK
const initializeAdmin = () => {
  // If the app is already initialized, return the existing app instance
  if (admin.apps.length) {
    return admin.app();
  }

  // Define the required environment variables
  const requiredKeys = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    // Include others if they are required and not defaulted
  ];

  // Basic check for required keys
  for (const key of requiredKeys) {
    if (!process.env[key]) {
      console.error(`❌ FATAL ERROR: Required Firebase Admin ENV variable is missing: ${key}`);
      return null;
    }
  }

  try {
    // 1. Build the ServiceAccount object from individual ENV variables
    // The FIREBASE_PRIVATE_KEY is a single string from the ENV.
    // We must replace the escaped newline sequences ('\n' or '\\n') with actual newline characters.
    // The regex /\\n/g targets the literal backslash-n sequence, ensuring the private key is valid PEM format.
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    

    const serviceAccount = {
      type: process.env.FIREBASE_TYPE || "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      
      // 🔥 CRITICAL FIX: The regex /\\n/g handles the most common escape issue for private keys.
      private_key: rawPrivateKey.replace(/\\n/g, '\n'),
    };
    
    // 2. Initialize the Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK initialized successfully.");
    return admin.app();

  } catch (error) {
    console.error("❌ Firebase Admin SDK Initialization Failed:", error);
    // Log the error info for more context if available
    if (error.errorInfo) {
      console.error("Error Info:", error.errorInfo);
    }
    return null;
  }
};

const firebaseAdminApp = initializeAdmin();

// Export the initialized auth service
export const adminAuth = firebaseAdminApp ? admin.auth() : null;

// Export the app instance if needed for other services (e.g., Firestore)
export default firebaseAdminApp;