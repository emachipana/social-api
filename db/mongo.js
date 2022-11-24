import mongoose from "mongoose";

function connectDB() {
  // environment variables destructuring
  const { DB_URI, DB_TEST_URI, NODE_ENV } = process.env;

  // choose between production or test database
  const DB = NODE_ENV === "test" ? DB_TEST_URI : DB_URI;

  // connect to database
  mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`database for ${NODE_ENV} connected`);
    })
    .catch((err) => {
      console.error(err.message);
    });

  // disconnect database on uncaught exception
  process.on("uncaughtException", (err) => {
    console.error(err);
    mongoose.disconnect();
  });
}

export default connectDB;
