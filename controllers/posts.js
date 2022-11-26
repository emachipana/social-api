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

// GET post by id
postsRouter.get("/:id", async (req, res, next) => {
  try {
    // get post from database and populate user and likes
    const post = await Post.findById(req.params.id)
      .populate("user", {
        avatar: 1,
        name: 1,
        date: 1
      })
      .populate("likes", {
        user: 1
      });

    // return response not found if post is not found
    if(!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  }catch(err) {
    next(err);
  }
});

export default postsRouter;
