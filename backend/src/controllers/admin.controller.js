import Article from '../models/Article.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    const totalBlogs = await Article.countDocuments({ type: 'blog' });
    const totalArticles = await Article.countDocuments({ type: 'article' });
    const totalUsers = await User.countDocuments({});
    const totalCategories = await Category.countDocuments({});

    const publishedCount = await Article.countDocuments({ status: 'Published' });
    const draftCount = await Article.countDocuments({ status: 'Draft' });
    const archivedCount = await Article.countDocuments({ status: 'Archived' });

    // Aggregate total views and likes
    const viewsLikes = await Article.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
        },
      },
    ]);

    const totalViews = viewsLikes[0]?.totalViews || 0;
    const totalLikes = viewsLikes[0]?.totalLikes || 0;

    // Recent content (last 10)
    const recentContent = await Article.find({})
      .populate('author', 'name profileImage')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title type status views likes createdAt slug');

    // Content by category
    const contentByCategory = await Article.aggregate([
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'cat' } },
      { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
      { $group: { _id: '$cat.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly content creation (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyData = await Article.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          blogs: { $sum: { $cond: [{ $eq: ['$type', 'blog'] }, 1, 0] } },
          articles: { $sum: { $cond: [{ $eq: ['$type', 'article'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        totalArticles,
        totalUsers,
        totalCategories,
        publishedCount,
        draftCount,
        archivedCount,
        totalViews,
        totalLikes,
        recentContent,
        contentByCategory,
        monthlyData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'AUTHOR', 'ADMIN'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role. Must be USER, AUTHOR, or ADMIN.');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent self-demotion
    if (user._id.toString() === req.user._id.toString() && role !== 'ADMIN') {
      res.status(400);
      throw new Error('Cannot change your own admin role');
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Cannot delete your own account from admin panel');
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (error) {
    next(error);
  }
};
