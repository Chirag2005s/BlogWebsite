import express from 'express';
import {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  deleteRoadmap,
} from '../controllers/roadmap.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes for viewing roadmaps
router.get('/', getRoadmaps);
router.get('/:id', getRoadmapById);

// Admin-only routes for creating and deleting roadmaps via Dashboard
router.post('/', protect, admin, createRoadmap);
router.delete('/:id', protect, admin, deleteRoadmap);

export default router;
