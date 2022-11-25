import express from "express";
import { config } from "dotenv";
import connectDB from "./db/mongo.js";
import usersRouter from "./controllers/users.js";
import handleErrors from "./middlewares/handleErrors.js";
import { configCloudinary } from "./services/cloudinary.js";

const app = express();

// init environment variables from .env file
config();

// start config for upload images to cloudinary
configCloudinary();

// connect to database
connectDB();

// to parse request body
app.use(express.json());

// users endpoints
app.use("/api/users", usersRouter);

// middlewares

// handle errors
app.use(handleErrors);

const PORT =  process.env.PORT || 3001;

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
