import { config } from "dotenv";
import connectDB from "./db/mongo.js";

// init environment variables from .env file
config();

// connect to database
connectDB();
