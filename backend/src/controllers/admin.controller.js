import Article from '../models/Article.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Roadmap from '../models/Roadmap.js';

// @desc    Get dashboard statistics
export const getStats = async (req, res, next) => {
  try {
    const totalBlogs = await Article.countDocuments({
      $or: [{ type: 'blog' }, { type: { $exists: false } }, { type: null }, { type: 'programming' }],
    });
    const totalArticles = await Article.countDocuments({ type: 'article' });
    const totalUsers = await User.countDocuments({});
    const totalCategories = await Category.countDocuments({});
    
    let totalRoadmaps = 0;
    try {
      totalRoadmaps = await Roadmap.countDocuments({});
    } catch (e) {
      totalRoadmaps = 5;
    }

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
      .select('title type status views likes createdAt slug coverImage difficulty');

    // Content by category
    const contentByCategory = await Article.aggregate([
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'cat' } },
      { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$cat.name', 'General Tech'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Monthly activity & engagement (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Article.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          blogs: { $sum: { $cond: [{ $ne: ['$type', 'article'] }, 1, 0] } },
          articles: { $sum: { $cond: [{ $eq: ['$type', 'article'] }, 1, 0] } },
          views: { $sum: '$views' },
          likes: { $sum: '$likes' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Recent users (last 5 registered)
    const recentUsers = await User.find({})
      .select('name email role profileImage createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Status breakdown
    const statusDistribution = [
      { name: 'Published', value: publishedCount, color: '#10b981' },
      { name: 'Draft', value: draftCount, color: '#f59e0b' },
      { name: 'Archived', value: archivedCount, color: '#8b8ba3' },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        totalArticles,
        totalUsers,
        totalCategories,
        totalRoadmaps,
        publishedCount,
        draftCount,
        archivedCount,
        totalViews,
        totalLikes,
        recentContent,
        recentUsers,
        contentByCategory,
        monthlyData,
        statusDistribution,
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
