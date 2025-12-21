import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  excerpt: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: true,
  },
  style: {
    backgroundColor: { type: String, default: '#ffffff' },
    fontFamily: { type: String, default: 'serif' },
    textColor: { type: String, default: '#000000' },
  },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
