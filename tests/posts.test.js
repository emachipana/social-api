import bcrypt from "bcrypt";
import User from "../models/User.js";
import supertest from "supertest";
import { app, server } from "../index.js";
import mongoose from "mongoose";
import Post from "../models/Post.js";

const api = supertest(app);

describe("creation of post", () => {
  // run before all actions
  beforeEach(async () => {
    // delete all users nad posts from database
    await User.deleteMany({ });
    await Post.deleteMany({ });    

    // create user to validate username unique
    const passwordHash = await bcrypt.hash("123456", 10);
    const newUser = new User({
      username: "mrx",
      name: "Enmanuel",
      last_name: "Chipana Araujo",
      passwordHash,
      date: new Date()
    });

    // save new user
    await newUser.save();
  });

  test("create post with a valid token", async () => {
    // login to get a token
    const data = {
      username: "mrx",
      password: "123456"
    }

    const session = await api
      .post("/api/session/login")
      .send(data)
      .expect(200)

    const { token } = session.body;
    
    // create post
    await api
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .type("form")
      .field("content", "My first post!!")
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });
});
