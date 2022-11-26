import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import upload from "../middlewares/multer.js";
import { cloudinary } from "../utils/cloudinary.js";

const sessionsRouter = Router();

// POST login
sessionsRouter.post("/login", async (req, res, next) => {
  const { username, password }= req.body;

  try {
    // get user based on username
    const user = await User.findOne({ username }).populate("posts", {
      content: 1,
      photo: 1,
      likes: 1,
      date: 1
    });
  
    // check password
    const isPasswordCorrect = user && await bcrypt.compare(password, user.passwordHash);
  
    // return if password is incorrect
    if(!isPasswordCorrect) return res.status(401).json({
      message: "Invalid password or username"
    });
  
     // generate token
     const { id, ...restOfUser } = user.toJSON();
     const infoForToken = { id, username };
     const token = jwt.sign(
       infoForToken,
       process.env.TOKEN_SECRET,
       {
         expiresIn: 60 * 60 * 24 * 7 // expire at 7 days
       }
     );
  
     // response to client
     res.json({ id, ...restOfUser, token });
  }catch(err) {
    next(err);
  }
});

// POST create user
sessionsRouter.post("/signup", upload.single("avatar"), async (req, res, next) => {
  const { username, name, last_name, password } = req.body;
  let uploadedImage = "";

  try {
    // config password hash
    const saltRounds = 10;
    const passwordHash = password
      ? await bcrypt.hash(password, saltRounds)
      : undefined;

    // upload image to cloudinary
    if(req.file) {
      uploadedImage = await cloudinary.uploader.upload(req.file.path);
    }

    const avatar = uploadedImage 
      ? {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url
        }
      : undefined;

    // create user
    const newUser = new User({
      username,
      name,
      last_name,
      passwordHash,
      avatar,
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
    );

    // response to client
    res.status(201).json({ id, ...user, token });
  }catch(err) {
    // remove image from cloudinary when app is crashed
    if(uploadedImage) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }
    next(err);
  }
});

export default sessionsRouter;
