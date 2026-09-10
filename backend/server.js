import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middlewares/error.middleware.js';

dotenv.config();

connectDB();

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

import authRoutes from './src/routes/auth.routes.js';
import articleRoutes from './src/routes/article.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import { syncCategories } from './src/controllers/category.controller.js';

// Synchronize categories with database
syncCategories();

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});