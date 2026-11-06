import express from 'express';
import {
  getProjects,
  getMyProjectHub,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleLikeProject,
  toggleBookmarkProject,
  getProjectComments,
  postProjectComment,
  deleteProjectComment,
  toggleLikeProjectComment,
} from '../controllers/projectController.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Current user's Project Hub portfolio & stats (must come before /:id)
router.get('/my-hub', protect, getMyProjectHub);

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/like', protect, toggleLikeProject);
router.post('/:id/bookmark', protect, toggleBookmarkProject);

router.route('/:id/comments')
  .get(getProjectComments)
  .post(protect, postProjectComment);

router.delete('/:id/comments/:commentId', protect, deleteProjectComment);
router.post('/:id/comments/:commentId/like', protect, toggleLikeProjectComment);

export default router;

