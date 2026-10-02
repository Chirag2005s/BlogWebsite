import mongoose from 'mongoose';

const problemCommentSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  voters: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voteType: { type: String, enum: ['like', 'dislike'] }
  }]
}, { timestamps: true });

const ProblemComment = mongoose.model('ProblemComment', problemCommentSchema);
export default ProblemComment;
