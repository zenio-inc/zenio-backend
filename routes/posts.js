import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Vote from "../models/Vote.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, content, postType } = req.body;

    const post = await Post.create({
      authorId: req.user.userId,
      username: req.user.username,
      title,
      content,
      postType
    });

    res.json({ ok: true, data: post });

  } catch (err) {
    res.json({ ok: false, error: "CREATE_POST_FAILED" });
  }
});


router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    const enriched = await Promise.all(
      posts.map(async (p) => {
        const votes = await Vote.find({ postId: p._id });
        const score = votes.reduce((sum, v) => sum + v.value, 0);

        return {
          ...p.toObject(),
          score
        };
      })
    );

    enriched.sort((a, b) => b.score - a.score);

    return res.json({
      ok: true,
      data: enriched
    });

  } catch (err) {
    return res.json({
      ok: false,
      type: "SERVER_ERROR",
      error: "FEED_FAILED",
      data: []
    });
  }
});


router.post("/vote", async (req, res) => {
  try {
    const { postId, userId, value } = req.body;

    if (![1, -1].includes(value)) {
      return res.json({
        ok: false,
        type: "VALIDATION_ERROR",
        error: "INVALID_VOTE_VALUE"
      });
    }

    const postExists = await Post.findById(postId);

    if (!postExists) {
      return res.json({
        ok: false,
        type: "NOT_FOUND",
        error: "POST_NOT_FOUND"
      });
    }

    const existing = await Vote.findOne({ postId, userId });

    if (existing) {
      existing.value = value;
      await existing.save();
    } else {
      await Vote.create({ postId, userId, value });
    }

    return res.json({ ok: true });

  } catch (err) {
    return res.json({
      ok: false,
      type: "SERVER_ERROR",
      error: "VOTE_FAILED"
    });
  }
});


router.post("/comment", async (req, res) => {
  try {
    const { postId, userId, username, text } = req.body;

    if (!text) {
      return res.json({
        ok: false,
        type: "VALIDATION_ERROR",
        error: "COMMENT_REQUIRED"
      });
    }

    const postExists = await Post.findById(postId);

    if (!postExists) {
      return res.json({
        ok: false,
        type: "NOT_FOUND",
        error: "POST_NOT_FOUND"
      });
    }

    const comment = await Comment.create({
      postId,
      userId,
      username,
      text
    });

    return res.json({
      ok: true,
      data: comment
    });

  } catch (err) {
    return res.json({
      ok: false,
      type: "SERVER_ERROR",
      error: "COMMENT_FAILED"
    });
  }
});

export default router;