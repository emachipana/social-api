import { Router } from "express";
import authorizeUser from "../middlewares/authorizeUser.js";
import validateOwnerUser from "../middlewares/validateOwnerUser.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const commentsRouter = Router();

// POST create comment
commentsRouter.post("/", authorizeUser ,async (req, res, next) => {
  const { content, postId } = req.body;
  const { userId } = req;

  try {
    // get user from database
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: "User not found" });
  
    // get post from database
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({ message: "Post not found" });
  
    // create new comment
    const newComment = new Comment({
      content,
      user: user._id,
      post: post._id,
      date: new Date()
    });
  
    // save comment
    const savedComment = await newComment.save();
    // add new comment to field comments in post
    post.comments = [...post.comments, savedComment._id];
    // update post
    await post.save();

    // response to client
    res.status(201).json(savedComment);
  }catch(err) {
    next(err);
  }
});

// PATCH update comment
commentsRouter.patch("/:id", [ authorizeUser, validateOwnerUser ], async (req, res, next) => {
  const { content } = req.body;

  try {
    const commentInfo = { content };

    // update comment
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      commentInfo,
      { new: true }
    );

    // response to client
    res.json(updatedComment);
  }catch(err) {
    next(err);
  }
});

// DELETE comment
commentsRouter.delete("/:id", [ authorizeUser, validateOwnerUser ], async (req, res, next) => {  
  try {
    // delete comment of database
    await Comment.deleteOne({ _id: req.params.id });

    // response to client
    res.json({ message: "Comment was deleted" });
  }catch(err) {
    next(err);
  }
});

export default commentsRouter;
