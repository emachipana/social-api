import express from "express";
import { config } from "dotenv";
import connectDB from "./db/mongo.js";
import usersRouter from "./controllers/users.js";
import handleErrors from "./middlewares/handleErrors.js";
import { configCloudinary } from "./utils/cloudinary.js";
import sessionsRouter from "./controllers/sessions.js";
import postsRouter from "./controllers/posts.js";
import commentsRouter from "./controllers/comments.js";
import likesRouter from "./controllers/likes.js";
import cors from "cors";
import notFound from "./middlewares/notFound.js";

const app = express();

// init environment variables from .env file
config();

// start config for upload images to cloudinary
configCloudinary();

// connect to database
connectDB();

// config cors
app.use(cors());

// to parse request body
app.use(express.json());

// users endpoints
app.use("/api/users", usersRouter);

// sessions endpoints
app.use("/api/session", sessionsRouter);

// posts endpoints
app.use("/api/posts", postsRouter);

// comments endpoints
app.use("/api/comments", commentsRouter);

// likes endpoints
app.use("/api/likes", likesRouter);

// middlewares
// handle errors
app.use(handleErrors);

// handle endpoints not found
app.use(notFound);

const PORT =  process.env.PORT || 3001;

const server = app.listen(PORT);

console.log(`Server running on port ${PORT}`);

export { server, app }
