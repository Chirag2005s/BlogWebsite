import express from 'express';
import { 
  getProblems, getProblemById, createProblem, updateProblem, deleteProblem,
  getSolutions, submitSolution, acceptSolution,
  getComments, postComment,
  getMyHubData, getUserHubData
} from '../controllers/problemController.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Hub statistics and user activity routes (MUST come before /:id)
router.get('/my-hub', protect, getMyHubData);
router.get('/user/:userId/hub', getUserHubData);

router.route('/')
  .get(getProblems)
  .post(protect, createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

router.route('/:id/solutions')
  .get(getSolutions)
  .post(protect, submitSolution);

router.route('/:id/solutions/:solutionId/accept')
  .patch(protect, acceptSolution);

router.route('/:id/comments')
  .get(getComments)
  .post(protect, postComment);

export default router;
