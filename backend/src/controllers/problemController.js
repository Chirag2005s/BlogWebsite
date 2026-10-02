import Problem from '../models/Problem.js';
import Solution from '../models/Solution.js';
import ProblemComment from '../models/ProblemComment.js';
import User from '../models/User.js';

// Get all problems
export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().populate('creator', 'name email').sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single problem by ID
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate('creator', 'name email');
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    
    // Increase view count
    problem.views += 1;
    await problem.save();
    
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new problem
export const createProblem = async (req, res) => {
  try {
    const { title, description, category, difficulty, language, type, tags, expectedBehavior, currentBehavior, inputFormat, outputFormat, constraints, exampleInput, exampleOutput, starterCode } = req.body;
    
    const problem = new Problem({
      title, description, category, difficulty, language, type, tags,
      expectedBehavior, currentBehavior, inputFormat, outputFormat, constraints,
      exampleInput, exampleOutput, starterCode,
      creator: req.user._id
    });
    
    const createdProblem = await problem.save();
    res.status(201).json(createdProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get solutions for a problem
export const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ problemId: req.params.id })
      .populate('user', 'name email')
      .sort({ likes: -1, createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a solution
export const submitSolution = async (req, res) => {
  try {
    const { language, code, explanation } = req.body;
    const problemId = req.params.id;
    
    const solution = new Solution({
      problemId,
      user: req.user._id,
      language,
      code,
      explanation
    });
    
    await solution.save();
    
    await Problem.findByIdAndUpdate(problemId, { $inc: { solutionsCount: 1 } });
    
    res.status(201).json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a problem
export const getComments = async (req, res) => {
  try {
    const comments = await ProblemComment.find({ problemId: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Post a comment
export const postComment = async (req, res) => {
  try {
    const { text } = req.body;
    const problemId = req.params.id;
    
    const comment = new ProblemComment({
      problemId,
      user: req.user._id,
      text
    });
    
    await comment.save();
    await Problem.findByIdAndUpdate(problemId, { $inc: { commentsCount: 1 } });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
