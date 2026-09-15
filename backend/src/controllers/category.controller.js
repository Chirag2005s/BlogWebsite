import Category from '../models/Category.js';
import slugify from 'slugify';

export const NEW_CATEGORIES = [
  {
    name: 'Artificial Intelligence',
    description: 'Autonomous systems, reasoning agents, AI safety, and cognitive architectures.',
  },
  {
    name: 'Machine Learning',
    description: 'Statistical modeling, predictive algorithms, deep neural nets, and ML pipelines.',
  },
  {
    name: 'Generative AI',
    description: 'Large language models, diffusion systems, transformers, and multimodal generation.',
  },
  {
    name: 'Robotics',
    description: 'Physical computing, robotic arms, sensor integration, kinematics, and ROS.',
  },
  {
    name: 'Web Technology',
    description: 'Modern frontend, backend engines, full-stack frameworks, and web platform standards.',
  },
  {
    name: 'Internet & Networking',
    description: 'Network protocols, cloud infrastructure, distributed systems, and telecommunications.',
  },
  {
    name: 'Hardware',
    description: 'Computer architecture, silicon design, GPUs, microcontrollers, and embedded devices.',
  },
];

// Helper to seed/synchronize categories: removes old categories not in the list, and ensures the 7 new ones exist
export const syncCategories = async () => {
  try {
    const allowedNames = NEW_CATEGORIES.map((c) => c.name);

    // Remove old categories not in the new list
    await Category.deleteMany({ name: { $nin: allowedNames } });

    // Ensure each new category exists
    for (const cat of NEW_CATEGORIES) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      await Category.findOneAndUpdate(
        { slug },
        { name: cat.name, slug, description: cat.description },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
  } catch (err) {
    console.error('Error synchronizing categories:', err.message);
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    await syncCategories();
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};
