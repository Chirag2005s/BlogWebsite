import mongoose from 'mongoose';

const projectCommentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    feedbackType: {
      type: String,
      enum: ['General', 'Feature Idea', 'Code Review', 'Bug Report', 'Appreciation'],
      default: 'General',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const ProjectComment = mongoose.model('ProjectComment', projectCommentSchema);
export default ProjectComment;

