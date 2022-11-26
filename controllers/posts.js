import { Router } from "express";
import authorizeUser from "../middlewares/authorizeUser.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { cloudinary } from "../services/cloudinary.js";
import upload from "../middlewares/multer.js";
import Like from "../models/Like.js";

const postsRouter = Router();

// GET all posts
postsRouter.get("/", async (_req, res) => {
  // get posts from database and populate user and likes
  await Like.find({ });
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

// POST create post
postsRouter.post("/", [ authorizeUser, upload.single("photo") ], async (req, res, next) => {
  const { content } = req.body;
  const { userId } = req;
  let uploadedImage = "";

  try {
    // get user from database
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: "User not found" });
  
    // upload image to cloudinary
    if(req.file) {
      uploadedImage = await cloudinary.uploader.upload(req.file.path);
    }

    const photo = uploadedImage
      ? {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      }
      : undefined;

    // create new post
    const newPost = new Post({
      user: user._id,
      content,
      photo,
      date: new Date()
    });

    // save post
    const savedPost = await newPost.save();
    // add new post to field posts in user
    user.posts = [...user.posts, savedPost._id];
    // update user
    await user.save();

    const { posts, ...restOfUser } = user.toJSON();

    const post = savedPost.toJSON();

    // response to client
    res.status(201).json({ ...post, user: restOfUser });
  }catch(err) {
    next(err);
  }

});

export default postsRouter;
