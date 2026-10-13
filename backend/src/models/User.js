import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['USER', 'AUTHOR', 'ADMIN'],
      default: 'USER',
    },
    roleTitle: {
      type: String,
      default: 'Full Stack Developer',
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    skills: [String],
    experience: [String],
    github: String,
    linkedin: String,

    // Community & Gamification System
    reputation: {
      type: Number,
      default: 100,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    badges: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, enum: ['Contribution', 'Learning', 'Community', 'Projects', 'Special'], default: 'Contribution' },
        description: { type: String, default: '' },
        icon: { type: String, default: '🏆' },
        awardedAt: { type: Date, default: Date.now },
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunityPost',
      },
    ],
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate username from name if not present
userSchema.pre('save', async function () {
  if (!this.username && this.name) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 15) || 'developer';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.username = `${baseSlug}_${randomSuffix}`;
  }

  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

