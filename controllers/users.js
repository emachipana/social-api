import { Router } from "express";
import User from "../models/User.js";
import { cloudinary } from "../services/cloudinary.js";
import upload from "../middlewares/multer.js";
import bcrypt from "bcrypt";
import authorizeUser from "../middlewares/authorizeUser.js";
import Post from "../models/Post.js";

const usersRouter = Router();

// GET user by id
usersRouter.get("/:id", async (req, res, next) => {
  try {
    // get user from database and populate with her posts
    const posts = await Post.find({ });
    console.log(posts);
    const user = await User.findById(req.params.id).populate("posts", {
      content: 1,
      photo: 1,
      likes: 1,
      date: 1
    });
  
    if(!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  }catch(err) {
    next(err);
  }
});

// DELETE user
usersRouter.delete("/", authorizeUser, async (req, res, next) => {
  const { userId } = req;
  
  try {
    // delete user and get user deleted
    const user = await User.findByIdAndDelete(userId);

    // handle userId does not match any doc
    if(!user) return res.status(404).json({ message: "User not found, try again" });

    // remove image from cloudinary
    if(user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // response to client
    res.json({ message: "User was deleted" });
  }catch(err) {
    next(err);
  }
});

// PATCH update user
usersRouter.patch("/", [ authorizeUser, upload.single("avatar") ], async (req, res, next) => {
  const { username, name, last_name, password } = req.body;
  let uploadedImage = "";

  try {
    // get user for update avatar
    const user = await User.findById(req.userId);

    // config password hash
    const saltRounds = 10;
    const passwordHash = password
      ? await bcrypt.hash(password, saltRounds)
      : undefined;

    // upload image to cloudinary
    if(req.file) {
      // remove image from cloudinary if this exist
      if(user.avatar.public_id) await cloudinary.uploader.destroy(user.avatar.public_id);
      // upload new image
      uploadedImage = await cloudinary.uploader.upload(req.file.path);
    }

    const avatar = uploadedImage 
      ? {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url
        }
      : undefined;

    // recollect info user
    const userInfo = {
      username,
      name,
      last_name,
      passwordHash,
      avatar
    };

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      userInfo,
      { new: true }  
    ).populate("posts", {
      content: 1,
      photo: 1,
      likes: 1,
      date: 1
    });
  
    // handle userId does not match any doc
    if(!updatedUser) return res.status(404).json({ message: "User not found, try again" });

    // response to client
    res.json(updatedUser);
  }catch(err) {
    // remove image from cloudinary when app is crashed
    if(uploadedImage) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(err);
  }
});

export default usersRouter;
