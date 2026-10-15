import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      default: 'home', // For future extension
    },
    buttonLink: {
      type: String,
      default: '',
      trim: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

const Advertisement = mongoose.model('Advertisement', advertisementSchema);
export default Advertisement;
