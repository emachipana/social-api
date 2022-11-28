import { Router } from "express";
import authorizeUser from "../middlewares/authorizeUser.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const likesRouter = Router();

// POST create like
likesRouter.post("/", authorizeUser, async (req, res, next) => {
  const { postId } = req.body;
  const { userId } = req;

  try {
    // get user from database
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: "User not found" });

    // get post from database
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({ message: "Post not found" });

    // create new like
    const newLike = new Like({
      user: user._id,
      post: post._id
    });

    // save like
    const savedLike = await newLike.save();
    // add new like to field likes in post
    post.likes = [...post.likes, savedLike._id];
    // update post
    await post.save();

    // response to client
    res.status(201).json(savedLike);
  }catch(err) {
    next(err);
  }
});

export default likesRouter;
