import { Router } from "express";
import User from "../models/User.js";
import upload from "../utils/multer.js";

const usersRouter = Router();

// GET user by id
usersRouter.get("/:id", async (req, res, next) => {
  try {
    // get user from database and populate with her posts
    const user = await User.findById(req.params.id).populate("posts", {
      content: 1,
      photo: 1,
      likes: 1,
      timestamps: 1
    });
  
    if(!user) return res.status(404).json({ message: "User not found" });
  
    res.json(user);
  }catch(err) {
    next(err);
  }
});

export default usersRouter;
