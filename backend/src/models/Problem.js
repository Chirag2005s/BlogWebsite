import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Backend' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  language: { type: String, default: 'JavaScript' },
  type: { type: String, enum: ['Standard', 'Debug Challenge'], default: 'Standard' },
  tags: [{ type: String }],
  
  expectedBehavior: { type: String },
  currentBehavior: { type: String },
  inputFormat: { type: String },
  outputFormat: { type: String },
  constraints: { type: String },
  
  exampleInput: { type: String },
  exampleOutput: { type: String },
  starterCode: { type: String },
  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  solutionsCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  isSolved: { type: Boolean, default: false },
  acceptedSolution: { type: mongoose.Schema.Types.ObjectId, ref: 'Solution' },
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
