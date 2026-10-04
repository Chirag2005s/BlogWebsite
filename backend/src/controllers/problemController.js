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
    const { 
      title, description, category, difficulty, language, type, tags, 
      expectedBehavior, currentBehavior, inputFormat, outputFormat, constraints, 
      exampleInput, exampleOutput, starterCode, creator, creatorId 
    } = req.body;
    
    const authorId = req.user?._id || creator || creatorId;
    if (!authorId) {
      return res.status(401).json({ message: 'User must be authenticated to create a problem' });
    }
    
    const problem = new Problem({
      title, description, category, difficulty, language, type, tags,
      expectedBehavior, currentBehavior, inputFormat, outputFormat, constraints,
      exampleInput, exampleOutput, starterCode,
      creator: authorId
    });
    
    const createdProblem = await problem.save();
    const populated = await Problem.findById(createdProblem._id).populate('creator', 'name email');
    res.status(201).json(populated || createdProblem);
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
    
    const populatedSolution = await Solution.findById(solution._id).populate('user', 'name email');
    res.status(201).json(populatedSolution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept or unaccept a solution (Problem creator only)
export const acceptSolution = async (req, res) => {
  try {
    const { id: problemId, solutionId } = req.params;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    if (String(problem.creator) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the author of this problem can accept solutions' });
    }

    const solution = await Solution.findById(solutionId);
    if (!solution) return res.status(404).json({ message: 'Solution not found' });

    if (solution.isAccepted) {
      solution.isAccepted = false;
      await solution.save();
      problem.isSolved = false;
      problem.acceptedSolution = null;
      await problem.save();
      return res.json({ message: 'Solution unaccepted', solution, problem });
    } else {
      await Solution.updateMany({ problemId, isAccepted: true }, { isAccepted: false });
      solution.isAccepted = true;
      await solution.save();
      problem.isSolved = true;
      problem.acceptedSolution = solution._id;
      await problem.save();
      return res.json({ message: 'Solution marked as accepted', solution, problem });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete problem
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    if (String(problem.creator) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the author of this problem can delete it' });
    }
    await Solution.deleteMany({ problemId: problem._id });
    await ProblemComment.deleteMany({ problemId: problem._id });
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate user hub metrics
const fetchUserHubMetrics = async (userId) => {
  const myProblems = await Problem.find({ creator: userId })
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });
  const problemsPosted = myProblems.length;

  const mySolutions = await Solution.find({ user: userId })
    .populate('problemId', 'title category difficulty isSolved')
    .sort({ createdAt: -1 });

  const distinctSolvedProblemIds = await Solution.distinct('problemId', { user: userId });
  const problemsSolved = distinctSolvedProblemIds.length;

  const acceptedSolutions = await Solution.countDocuments({ user: userId, isAccepted: true });

  const activityDates = new Set();
  myProblems.forEach(p => activityDates.add(new Date(p.createdAt).toISOString().split('T')[0]));
  mySolutions.forEach(s => activityDates.add(new Date(s.createdAt).toISOString().split('T')[0]));

  let streak = 0;
  const sortedDates = Array.from(activityDates).sort().reverse();
  if (sortedDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      let checkDate = new Date(sortedDates[0]);
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDay = new Date(checkDate);
        prevDay.setDate(prevDay.getDate() - 1);
        const prevDayStr = prevDay.toISOString().split('T')[0];
        if (sortedDates[i] === prevDayStr) {
          streak++;
          checkDate = prevDay;
        } else {
          break;
        }
      }
    }
  }

  const skillCounts = {};
  myProblems.forEach(p => {
    if (p.category) skillCounts[p.category] = (skillCounts[p.category] || 0) + 1;
    if (p.language) skillCounts[p.language] = (skillCounts[p.language] || 0) + 1;
  });
  mySolutions.forEach(s => {
    if (s.language) skillCounts[s.language] = (skillCounts[s.language] || 0) + 1;
  });
  let topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);
  if (topSkills.length === 0) {
    topSkills = ['JavaScript', 'Problem Solving'];
  }

  let totalLikes = 0;
  myProblems.forEach(p => totalLikes += (p.likes || 0));
  mySolutions.forEach(s => totalLikes += (s.likes || 0));
  const reputation = 100 + (problemsPosted * 20) + (problemsSolved * 30) + (acceptedSolutions * 60) + (totalLikes * 10);

  const activity = [
    ...myProblems.map(p => ({
      type: 'problem_posted',
      id: p._id,
      title: p.title,
      category: p.category,
      difficulty: p.difficulty,
      createdAt: p.createdAt
    })),
    ...mySolutions.map(s => ({
      type: 'solution_submitted',
      id: s._id,
      problemId: s.problemId?._id || s.problemId,
      title: s.problemId?.title || 'Problem Solution',
      language: s.language,
      isAccepted: s.isAccepted,
      createdAt: s.createdAt
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);

  return {
    stats: {
      problemsPosted,
      problemsSolved,
      acceptedSolutions,
      streak,
      reputation,
      topSkills
    },
    problems: myProblems,
    solutions: mySolutions,
    activity
  };
};

// Get current logged-in user's Hub Data
export const getMyHubData = async (req, res) => {
  try {
    const data = await fetchUserHubMetrics(req.user._id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get any user's public Hub Data
export const getUserHubData = async (req, res) => {
  try {
    const data = await fetchUserHubMetrics(req.params.userId);
    res.json(data);
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
    
    const populatedComment = await ProblemComment.findById(comment._id).populate('user', 'name email');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
