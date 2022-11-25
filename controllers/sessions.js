import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
     res.json({ ...restOfUser, token });
  }catch(err) {
    next(err);
  }
});

export default sessionsRouter;
