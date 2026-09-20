import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  tag: { type: String, default: 'Core Skill' },
  description: { type: String, required: true },
  keyTopics: [{ type: String }],
  articleSlug: { type: String, default: '' },
});

const phaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  nodes: [nodeSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true, default: 'Web Development' },
    description: { type: String, required: true },
    icon: { type: String, default: 'Compass' },
    color: { type: String, default: 'from-blue-600 to-cyan-500' },
    borderColor: { type: String, default: 'border-blue-500/30' },
    estimatedTime: { type: String, default: '6-8 Months' },
    level: { type: String, default: 'Beginner to Advanced' },
    phases: [phaseSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
