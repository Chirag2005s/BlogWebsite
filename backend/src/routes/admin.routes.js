import express from 'express';
import {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
