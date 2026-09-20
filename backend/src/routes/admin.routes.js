import express from 'express';
import {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/admin.controller.js';
import { protect, admin, author } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Stats & user list — accessible to both ADMIN and AUTHOR (dashboard users)
router.get('/stats', protect, author, getStats);
router.get('/users', protect, author, getAllUsers);

// Destructive operations — ADMIN only
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;

