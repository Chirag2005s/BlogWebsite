import express from 'express';
import {
  getInterviewQuestions,
  getInterviewQuestionById,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
  getInterviewCategories,
} from '../controllers/interview.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getInterviewQuestions);
router.get('/categories', getInterviewCategories);
router.get('/:id', getInterviewQuestionById);

router.post('/', protect, createInterviewQuestion);
router.put('/:id', protect, updateInterviewQuestion);
router.delete('/:id', protect, deleteInterviewQuestion);

export default router;
