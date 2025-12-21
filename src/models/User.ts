import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // User credentials and profile
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
