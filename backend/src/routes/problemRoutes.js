import express from 'express';
import { 
  getProblems, getProblemById, createProblem, 
  getSolutions, submitSolution, 
  getComments, postComment 
} from '../controllers/problemController.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getProblems)
  .post(protect, createProblem);

router.route('/:id')
  .get(getProblemById);

router.route('/:id/solutions')
  .get(getSolutions)
  .post(protect, submitSolution);

router.route('/:id/comments')
  .get(getComments)
  .post(protect, postComment);

export default router;
