import mongoose from 'mongoose';

let isConnected = false;
let isConnecting = false;
let connectionError = null;

// Event listeners for MongoDB connection state
mongoose.connection.on('connected', () => {
  isConnected = true;
  connectionError = null;
  console.log('✅ Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  connectionError = err.message;
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ Mongoose default connection disconnected');
});

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    connectionError = null;
    return;
  }

  if (isConnecting) {
    return;
  }

  const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : '';

  if (!uri) {
    connectionError = 'MONGO_URI environment variable is missing. Please set MONGO_URI in Render Environment Variables.';
    console.error('❌ MongoDB Error:', connectionError);
    return;
  }

  if (uri.includes('localhost') || uri.includes('127.0.0.1') || uri.includes('::1')) {
    connectionError = 'MONGO_URI is set to localhost/127.0.0.1, which cannot be reached from Render cloud servers. You must use a MongoDB Atlas cloud URI (mongodb+srv://...).';
    console.warn('⚠️ WARNING:', connectionError);
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    connectionError = null;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  } finally {
    isConnecting = false;
  }
};

export const getDBStatus = () => {
  const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : '';
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    error: connectionError,
    uriConfigured: Boolean(uri),
    isLocalhost: Boolean(uri && (uri.includes('localhost') || uri.includes('127.0.0.1') || uri.includes('::1'))),
  };
};

export default connectDB;

