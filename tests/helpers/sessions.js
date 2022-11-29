import User from "../../models/User.js";

async function getUsers() {
  // get all users from database
  const usersDB = await User.find({ });
  // return users convert to JSON
  return usersDB.map((user) => user.toJSON());
}

export {
  getUsers
}
