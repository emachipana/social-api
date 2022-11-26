import { Router } from "express";
import Post from "../models/Post.js";

const postsRouter = Router();

// GET all posts
postsRouter.get("/", async (_req, res) => {
  // get posts from database and populate user and likes
  const posts = await Post.find({ })
    .populate("user", {
      avatar: 1,
      name: 1,
      date: 1
    })
    .populate("likes", {
      user: 1
    });
  
  // response to client
  res.json(posts);
});

export default postsRouter;
