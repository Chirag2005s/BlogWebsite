import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('MongoDB Error: MONGO_URI is not defined in environment variables.');
    return;
  }

  if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI.includes('localhost')) {
    console.warn('⚠️ WARNING: MONGO_URI points to localhost in production. Please configure a MongoDB Atlas cloud URI in your Render environment variables!');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

export default connectDB;
