import express from 'express';
import {
  getArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticlesForAdmin,
  likeArticle,
} from '../controllers/article.controller.js';
import { protect, optionalProtect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getArticles)
  .post(protect, createArticle);

// Admin route must come BEFORE /:slug to avoid matching 'admin' as a slug
router.get('/admin/all', protect, getAllArticlesForAdmin);

// Get article by ID for editing
router.get('/id/:id', protect, getArticleById);

// Like route
router.post('/:id/like', protect, likeArticle);

router.route('/:slug')
  .get(optionalProtect, getArticleBySlug);

router.route('/:id')
  .put(protect, updateArticle)
  .delete(protect, deleteArticle);

export default router;
