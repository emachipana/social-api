import bcrypt from "bcrypt";
import User from "../models/User.js";
import supertest from "supertest";
import { app, server } from "../index.js";
import { getUsers } from "./helpers/sessions.js";
import mongoose from "mongoose";

const api = supertest(app);

describe("register and login with a user", () => {
  // run before all actions
  beforeEach(async () => {
    // delete all users from database
    await User.deleteMany({ });

    // create user to validate username unique
    const passwordHash = await bcrypt.hash("123456", 10);
    const newUser = new User({
      username: "test",
      name: "Testino",
      last_name: "Di Prueba",
      passwordHash,
      date: new Date()
    });

    // save new user
    await newUser.save();
  });

  test("create user without an avatar", async () => {
    // send data to api
    await api
      .post("/api/session/signup")
      .type("form")
      .field("username", "mrx")
      .field("name", "Enmanuel")
      .field("last_name", "Chipana Araujo")
      .field("password", "123456")
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAfterCreate = await getUsers();
    // expect length equal 2
    expect(usersAfterCreate).toHaveLength(2);
  });

  test("create a user with an already existing username", async () => {
    // send data to api
    await api
      .post("/api/session/signup")
      .type("form")
      .field("username", "test")
      .field("name", "Probino")
      .field("last_name", "Di Prueba")
      .field("password", "letmein")
      .expect(422)
      .expect("Content-Type", /application\/json/);
    
    const usersAfterCreate = await getUsers();
    // user should not have been created
    expect(usersAfterCreate).toHaveLength(1);
  });

  test("login with correct data", async () => {
    // data for login
    const data = {
      username: "test",
      password: "123456"
    }
    
    // send data to api
    await api
      .post("/api/session/login")
      .send(data)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });
});
