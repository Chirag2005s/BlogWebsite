import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
const protect = async (req, res, next) => {
  let token = req.cookies?.jwt;

  // Support Authorization: Bearer <token>
  if (!token && req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('User account not found. Please log in again.'));
      }
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, please log in to perform this action'));
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin'));
  }
};

// Author middleware
const author = (req, res, next) => {
  if (req.user && (req.user.role === 'AUTHOR' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an author'));
  }
};

// Optional protect - attaches user if token exists, but doesn't block if not
const optionalProtect = async (req, res, next) => {
  let token = req.cookies?.jwt;

  if (!token && req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Ignore token failure for optional auth
      req.user = null;
    }
  }
  next();
};

export { protect, optionalProtect, admin, author };
