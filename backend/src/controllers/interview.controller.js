import InterviewQuestion from '../models/InterviewQuestion.js';

// @desc    Get all interview questions (with filtering, search, pagination)
// @route   GET /api/interviews
// @access  Public
export const getInterviewQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, search, limit = 100, page = 1 } = req.query;

    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { explanation: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { companyTags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await InterviewQuestion.countDocuments(query);
    const questions = await InterviewQuestion.find(query)
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview question by ID
// @route   GET /api/interviews/:id
// @access  Public
export const getInterviewQuestionById = async (req, res, next) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id).populate('createdBy', 'name email avatar');

    if (!question) {
      res.status(404);
      return next(new Error('Interview question not found'));
    }

    // Increment view count
    question.views = (question.views || 0) + 1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new interview question
// @route   POST /api/interviews
// @access  Private (Authenticated User / Admin)
export const createInterviewQuestion = async (req, res, next) => {
  try {
    const { question, answer, category, difficulty, codeSnippet, explanation, tags, companyTags } = req.body;

    if (!question || !answer) {
      res.status(400);
      return next(new Error('Question title and Answer are required'));
    }

    const newQuestion = await InterviewQuestion.create({
      question,
      answer,
      category: category || 'General',
      difficulty: difficulty || 'Medium',
      codeSnippet: codeSnippet || '',
      explanation: explanation || '',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      companyTags: Array.isArray(companyTags) ? companyTags : typeof companyTags === 'string' ? companyTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      createdBy: req.user?._id,
      isPublished: true,
    });

    res.status(201).json({
      success: true,
      message: 'Interview question created successfully',
      data: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview question
// @route   PUT /api/interviews/:id
// @access  Private
export const updateInterviewQuestion = async (req, res, next) => {
  try {
    let question = await InterviewQuestion.findById(req.params.id);

    if (!question) {
      res.status(404);
      return next(new Error('Interview question not found'));
    }

    const { question: qTitle, answer, category, difficulty, codeSnippet, explanation, tags, companyTags, isPublished } = req.body;

    if (qTitle) question.question = qTitle;
    if (answer) question.answer = answer;
    if (category) question.category = category;
    if (difficulty) question.difficulty = difficulty;
    if (codeSnippet !== undefined) question.codeSnippet = codeSnippet;
    if (explanation !== undefined) question.explanation = explanation;
    if (isPublished !== undefined) question.isPublished = isPublished;

    if (tags !== undefined) {
      question.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    }

    if (companyTags !== undefined) {
      question.companyTags = Array.isArray(companyTags) ? companyTags : typeof companyTags === 'string' ? companyTags.split(',').map((t) => t.trim()).filter(Boolean) : [];
    }

    const updatedQuestion = await question.save();

    res.status(200).json({
      success: true,
      message: 'Interview question updated successfully',
      data: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview question
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterviewQuestion = async (req, res, next) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);

    if (!question) {
      res.status(404);
      return next(new Error('Interview question not found'));
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Interview question deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview question category stats
// @route   GET /api/interviews/categories
// @access  Public
export const getInterviewCategories = async (req, res, next) => {
  try {
    const stats = await InterviewQuestion.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categories = stats.map((s) => ({
      name: s._id,
      count: s.count,
    }));

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
