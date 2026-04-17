import express from "express";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.js";

const app = express();

app.use(express.json());

// routes
app.use("/api/posts", postsRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Zenio backend running" });
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Zenio backend running on port", PORT);
});