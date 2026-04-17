import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  username: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    default: ""
  },

  contentType: {
    type: String,
    enum: ["text", "markdown", "richtext"],
    default: "text"
  },

  postType: {
    type: String,
    enum: ["text", "image", "link", "repost"],
    default: "text"
  },

  mediaUrl: {
    type: String,
    default: null
  },

  linkUrl: {
    type: String,
    default: null
  },

  originalPostId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Post', postSchema);