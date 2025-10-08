import mongoose from "mongoose";

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Check if the URI is set
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Cache the connection status to prevent multiple connections during hot-reloading
let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

/**
 * Global function to connect to MongoDB.
 * @returns {Promise<mongoose.Connection>} The active Mongoose connection.
 */
export async function connectDB() {
  // If a connection already exists, return it
  if (cachedConnection.conn) {
    console.log("✅ MongoDB: Using existing connection.");
    return cachedConnection.conn;
  }

  // If there's no pending connection promise, create one
  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false, // Recommended for serverless environments
    };

    cachedConnection.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
      });
  }

  // Await the promise to get the connection object
  try {
    const db = await cachedConnection.promise;
    cachedConnection.conn = db.connection;
    console.log("✅ MongoDB: New connection established.");
    return db.connection;
  } catch (err) {
    cachedConnection.promise = null; // Reset promise on failure
    throw err;
  }
}
