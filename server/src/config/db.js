// ============================================
// MongoDB Connection Setup
// ============================================
// Handles database connection with retry logic and proper error handling

import mongoose from 'mongoose';
import env from './env.js';

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

let retryCount = 0;

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');

    const conn = await mongoose.connect(env.mongodb.uri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; // Reset retry count on success
    return conn;

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      retryCount += 1;
      console.log(`🔄 Retrying... (${retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY / 1000}s`);
      
      setTimeout(() => {
        connectDB();
      }, RETRY_DELAY);
    } else {
      console.error('❌ Failed to connect to MongoDB after multiple retries');
      console.warn('⚠️ Starting server in DEVELOPMENT MOCK MODE (No Database)');
      process.env.USE_MOCK_DATA = 'true';
      // Do not exit, let the server start for frontend development
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected, attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

export default connectDB;
