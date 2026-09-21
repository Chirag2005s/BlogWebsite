import mongoose from 'mongoose';
import Article from '../models/Article.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import slugify from 'slugify';

// Helper to resolve category ID from name, slug, or ID
const resolveCategoryId = async (category) => {
  if (!category) return null;
  if (typeof category === 'object' && category?._id) {
    category = category._id.toString();
  }
  if (typeof category !== 'string') {
    category = String(category);
  }
  if (mongoose.isValidObjectId(category)) {
    const exists = await Category.findById(category);
    if (exists) return exists._id;
  }
  const escapedName = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const catDoc = await Category.findOne({
    $or: [
      { name: new RegExp(`^${escapedName}$`, 'i') },
      { slug: slugify(category, { lower: true, strict: true }) },
    ],
  });
  return catDoc ? catDoc._id : null;
};

// @desc    Get all published articles (filterable by ?type=blog or ?type=article, and ?category=slug)
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res, next) => {
  try {
    const filter = { status: 'Published' };

    if (req.query.type) {
      const typeParam = req.query.type.toLowerCase();
      if (typeParam === 'article') {
        filter.type = 'article';
      } else if (typeParam === 'blog') {
        filter.$or = [
          { type: 'blog' },
          { type: { $exists: false } },
          { type: null },
        ];
      }
    }

    if (req.query.category) {
      const catId = await resolveCategoryId(req.query.category);
      if (catId) {
        filter.category = catId;
      }
    }

    const articles = await Article.find(filter)
      .populate('author', 'name profileImage')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('readers', 'name profileImage')
      .populate('likedBy', 'name profileImage')
      .sort({ publishedAt: -1 });
    
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles for admin (including drafts, filterable by ?type)
// @route   GET /api/articles/admin/all
// @access  Private
export const getAllArticlesForAdmin = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      res.status(401);
      throw new Error('Not authorized, login required');
    }

    // Only return articles personally uploaded by the logged-in user
    const filter = { author: req.user._id };

    if (req.query.type) {
      const typeParam = req.query.type.toLowerCase();
      if (typeParam === 'article') {
        filter.type = 'article';
      } else if (typeParam === 'blog') {
        filter.$or = [
          { type: 'blog' },
          { type: { $exists: false } },
          { type: null },
        ];
      }
    }

    const articles = await Article.find(filter)
      .populate('author', 'name profileImage')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('readers', 'name profileImage')
      .populate('likedBy', 'name profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get article by slug
// @route   GET /api/articles/:slug
// @access  Public (Optional Auth for reader tracking)
export const getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, status: 'Published' })
      .populate('author', 'name profileImage bio')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('readers', 'name profileImage')
      .populate('likedBy', 'name profileImage');

    if (article) {
      // Increment views
      article.views += 1;

      // Track reader if authenticated user visited
      if (req.user && req.user._id) {
        const alreadyRead = article.readers.some(
          (reader) => reader && (reader._id ? reader._id.toString() : reader.toString()) === req.user._id.toString()
        );
        if (!alreadyRead) {
          article.readers.push(req.user._id);
        }
      }

      await article.save();

      // Ensure readers are populated with details if updated
      if (req.user && req.user._id) {
        await article.populate('readers', 'name profileImage');
      }

      res.status(200).json({ success: true, data: article });
    } else {
      res.status(404);
      throw new Error('Article not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get article by ID (for admin/editing)
// @route   GET /api/articles/id/:id
// @access  Private
export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name profileImage bio')
      .populate('category', 'name slug')
      .populate('tags', 'name slug');

    if (!article) {
      res.status(404);
      throw new Error('Article not found');
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / unlike article
// @route   POST /api/articles/:id/like
// @access  Private
export const likeArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error('Article not found');
    }

    const userId = req.user?._id;
    if (!userId) {
      res.status(401);
      throw new Error('Please log in to like this article');
    }

    const isLiked = article.likedBy.some(
      (id) => id && (id._id ? id._id.toString() : id.toString()) === userId.toString()
    );

    if (isLiked) {
      // Unlike
      article.likedBy = article.likedBy.filter(
        (id) => id && (id._id ? id._id.toString() : id.toString()) !== userId.toString()
      );
      article.likes = Math.max(0, article.likes - 1);
    } else {
      // Like
      article.likedBy.push(userId);
      article.likes += 1;
    }

    await article.save();
    await article.populate('likedBy', 'name profileImage');

    res.status(200).json({
      success: true,
      liked: !isLiked,
      likes: article.likes,
      likedBy: article.likedBy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new article or blog
// @route   POST /api/articles
// @access  Private/Author
export const createArticle = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      difficulty,
      status,
      type = 'blog',
      coverImage,
      seoTitle,
      seoDescription,
      author: authorFromClient,
    } = req.body;

    // Resolve author: prefer req.user._id, fallback to client author or database admin/user
    let authorId = req.user?._id;
    if (!authorId && authorFromClient && mongoose.isValidObjectId(authorFromClient)) {
      const exists = await User.findById(authorFromClient);
      if (exists) authorId = exists._id;
    }
    if (!authorId) {
      const fallbackUser = (await User.findOne({ role: 'ADMIN' })) || (await User.findOne({}));
      if (fallbackUser) {
        authorId = fallbackUser._id;
      }
    }

    if (!authorId) {
      res.status(401);
      throw new Error('Author user not found. Please log in again.');
    }

    let slug = slugify(title || 'untitled', { lower: true, strict: true });
    const existing = await Article.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const categoryId = await resolveCategoryId(category);

    const article = new Article({
      title,
      slug,
      excerpt,
      content,
      category: categoryId,
      tags: Array.isArray(tags) ? tags : [],
      difficulty: difficulty || 'Beginner',
      status: status || 'Draft',
      type: type ? type.toLowerCase() : 'blog',
      coverImage: coverImage || '',
      seoTitle,
      seoDescription,
      author: authorId,
      publishedAt: status === 'Published' ? Date.now() : null,
      readingTime: content ? Math.ceil(content.split(/\s+/).filter(Boolean).length / 200) : 1,
    });

    const createdArticle = await article.save();
    res.status(201).json({ success: true, data: createdArticle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Author
export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (article) {
      const currentUserId = req.user?._id?.toString();
      const isAuthor = article.author && currentUserId && article.author.toString() === currentUserId;

      if (!isAuthor) {
        res.status(403);
        throw new Error('Not authorized to update this publication. You can only update your own blogs or articles.');
      }

      const {
        title,
        excerpt,
        content,
        category,
        tags,
        difficulty,
        status,
        type,
        coverImage,
        seoTitle,
        seoDescription,
      } = req.body;

      article.title = title || article.title;
      if (title) {
        article.slug = slugify(title, { lower: true, strict: true });
      }
      article.excerpt = excerpt || article.excerpt;
      article.content = content || article.content;
      if (category !== undefined) {
        article.category = await resolveCategoryId(category);
      }
      article.tags = tags || article.tags;
      article.difficulty = difficulty || article.difficulty;
      if (type) {
        article.type = type.toLowerCase();
      }
      
      if (status && status !== article.status) {
        article.status = status;
        if (status === 'Published' && !article.publishedAt) {
          article.publishedAt = Date.now();
        }
      }
      
      article.coverImage = coverImage || article.coverImage;
      article.seoTitle = seoTitle || article.seoTitle;
      article.seoDescription = seoDescription || article.seoDescription;
      
      if (content) {
        article.readingTime = Math.ceil(content.split(/\s+/).filter(Boolean).length / 200);
      }

      const updatedArticle = await article.save();
      res.status(200).json({ success: true, data: updatedArticle });
    } else {
      res.status(404);
      throw new Error('Article not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Author
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (article) {
      const currentUserId = req.user?._id?.toString();
      const isAuthor = article.author && currentUserId && article.author.toString() === currentUserId;

      if (!isAuthor) {
        res.status(403);
        throw new Error('Not authorized to delete this publication. You can only delete your own blogs or articles.');
      }

      await article.deleteOne();
      res.status(200).json({ success: true, message: 'Article removed' });
    } else {
      res.status(404);
      throw new Error('Article not found');
    }
  } catch (error) {
    next(error);
  }
};
