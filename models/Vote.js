import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },

  UID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  value: {
    type: Number,
    enum: [1, -1], // 1 = upvote, -1 = downvote
    required: true,
  },
});

export default mongoose.model("Vote", voteSchema);
