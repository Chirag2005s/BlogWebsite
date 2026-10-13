import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill all required fields (name, email, and password)');
    }

    if (password.length < 8) {
      res.status(400);
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      res.status(400);
      throw new Error('Password must contain at least one uppercase letter (A-Z)');
    }

    if (!/[a-z]/.test(password)) {
      res.status(400);
      throw new Error('Password must contain at least one lowercase letter (a-z)');
    }

    if (!/[0-9]/.test(password)) {
      res.status(400);
      throw new Error('Password must contain at least one number (0-9)');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      res.status(400);
      throw new Error('Password must contain at least one special character (!@#$%^&*...)');
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'ADMIN' : 'USER';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          roleTitle: user.roleTitle,
          profileImage: user.profileImage,
          reputation: user.reputation,
          xp: user.xp,
          level: user.level,
          badges: user.badges,
          token,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data received');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);

      // Auto-assign username if missing
      if (!user.username && user.name) {
        const baseSlug = user.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'developer';
        user.username = `${baseSlug}_${Math.floor(1000 + Math.random() * 9000)}`;
        await user.save();
      }

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          roleTitle: user.roleTitle,
          profileImage: user.profileImage,
          bio: user.bio,
          location: user.location,
          website: user.website,
          skills: user.skills,
          reputation: user.reputation || 100,
          xp: user.xp || 0,
          level: user.level || 1,
          badges: user.badges || [],
          token,
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          roleTitle: user.roleTitle,
          bio: user.bio,
          location: user.location,
          website: user.website,
          skills: user.skills,
          experience: user.experience,
          github: user.github,
          linkedin: user.linkedin,
          profileImage: user.profileImage,
          reputation: user.reputation || 100,
          xp: user.xp || 0,
          level: user.level || 1,
          streak: user.streak || 1,
          badges: user.badges || [],
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.username) {
        const cleanUser = req.body.username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
        if (cleanUser && cleanUser !== user.username) {
          const taken = await User.findOne({ username: cleanUser, _id: { $ne: user._id } });
          if (taken) {
            res.status(400);
            throw new Error('Username already taken. Please choose another.');
          }
          user.username = cleanUser;
        }
      }
      user.email = req.body.email || user.email;
      user.roleTitle = req.body.roleTitle !== undefined ? req.body.roleTitle : user.roleTitle;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.website = req.body.website !== undefined ? req.body.website : user.website;
      user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;
      user.github = req.body.github !== undefined ? req.body.github : user.github;
      user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
      if (req.body.skills) user.skills = req.body.skills;
      if (req.body.experience) user.experience = req.body.experience;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          roleTitle: updatedUser.roleTitle,
          bio: updatedUser.bio,
          location: updatedUser.location,
          website: updatedUser.website,
          skills: updatedUser.skills,
          experience: updatedUser.experience,
          github: updatedUser.github,
          linkedin: updatedUser.linkedin,
          profileImage: updatedUser.profileImage,
          reputation: updatedUser.reputation,
          xp: updatedUser.xp,
          level: updatedUser.level,
          badges: updatedUser.badges,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

