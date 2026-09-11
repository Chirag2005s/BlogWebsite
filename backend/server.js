import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';
import connectDB, { getDBStatus } from './src/config/db.js';
import { notFound, errorHandler } from './src/middlewares/error.middleware.js';
import authRoutes from './src/routes/auth.routes.js';
import articleRoutes from './src/routes/article.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import { syncCategories } from './src/controllers/category.controller.js';

dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  if (mongoose.connection.readyState === 1) {
    syncCategories();
  }
}).catch((err) => {
  console.error('Initial DB connection error:', err.message);
});

const app = express();

// Security middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Prevent blocking cross-origin images/assets
  })
);

// Dynamic CORS configuration
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, '').toLowerCase())
  : [];

const allowedOrigins = new Set([...defaultOrigins.map((o) => o.toLowerCase()), ...envOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Dynamically reflect requesting origin to allow localhost, LAN IP (192.168.x.x), Vercel, Render, etc.
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // Omitting allowedHeaders allows cors to dynamically mirror request Access-Control-Request-Headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/', (req, res) => {
  const db = getDBStatus();
  res.json({
    status: 'online',
    message: 'API is running...',
    database: db.isConnected ? 'connected' : 'disconnected',
    databaseDetails: {
      readyState: db.readyState,
      uriConfigured: db.uriConfigured,
      isLocalhost: db.isLocalhost,
      error: db.error,
    },
  });
});

// Ensure database connection is ready for incoming requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      const db = getDBStatus();
      return res.status(503).json({
        success: false,
        message: 'Database connection is not ready.',
        details: db.error || 'MongoDB is not connected. Please verify MONGO_URI in Render Environment Variables.',
        uriConfigured: db.uriConfigured,
        isLocalhost: db.isLocalhost,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start HTTP listener if not running in a serverless environment (e.g., Vercel)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;