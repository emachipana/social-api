import { Router } from "express";
import User from "../models/User.js";
import { cloudinary } from "../services/cloudinary.js";
import upload from "../middlewares/multer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// POST create user
usersRouter.post("/", upload.single("avatar"), async (req, res, next) => {
  const { username, name, last_name, password } = req.body;
  let uploadedImage = "";

  try {
    // config password hash
    const saltRounds = 10;
    const passwordHash = password
      ? await bcrypt.hash(password, saltRounds)
      : undefined;

    // upload image to cloudinary
    uploadedImage = await cloudinary.uploader.upload(req.file.path);

    // create user
    const newUser = new User({
      username,
      name,
      last_name,
      passwordHash: passwordHash,
      avatar: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      },
      date: new Date()
    });

    // save user
    const savedUser = await newUser.save();

    // generate token
    const { id, ...user } = savedUser.toJSON();
    const infoForToken = { id, username };
    const token = jwt.sign(
      infoForToken,
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 7 // expire at 7 days
      }
    )

    // response to client
    res.status(201).json({ id, ...user, token });
  }catch(err) {
    // remove image from cloudinary when app is crashed
    await cloudinary.uploader.destroy(uploadedImage.public_id);
    next(err);
  }
});

export default usersRouter;
