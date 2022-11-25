import uniqueValidator from "mongoose-unique-validator";
import { model, Schema } from "mongoose";

// define schema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatar: {
    public_id: String,
    url: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }],
  date: {
    type: String,
    required: true
  }
});

// config when user object is convert to JSON format
userSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    if(!doc.avatar.public_id) {
      returnedObject.avatar = {};
    }
  }
});

// add unique validator helper to user schema
userSchema.plugin(uniqueValidator);

// define model
const User = model("User", userSchema);

export default User;
