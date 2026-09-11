import mongoose from 'mongoose';

let isConnected = false;
let isConnecting = false;
let connectionError = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    connectionError = null;
    return;
  }

  if (isConnecting) {
    return;
  }

  if (!process.env.MONGO_URI) {
    connectionError = 'MONGO_URI is missing in environment variables. Please add MONGO_URI in Render Environment Variables.';
    console.error('MongoDB Error:', connectionError);
    return;
  }

  if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI.includes('localhost')) {
    connectionError = 'MONGO_URI is set to localhost, which cannot be reached on Render cloud servers. You must use a MongoDB Atlas cloud URI (mongodb+srv://...).';
    console.warn('⚠️ WARNING:', connectionError);
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    connectionError = null;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.error(`MongoDB Connection Error: ${error.message}`);
  } finally {
    isConnecting = false;
  }
};

export const getDBStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    error: connectionError,
    uriConfigured: Boolean(process.env.MONGO_URI),
    isLocalhost: Boolean(process.env.MONGO_URI && process.env.MONGO_URI.includes('localhost')),
  };
};

export default connectDB;
