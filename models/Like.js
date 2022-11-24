import { model, Schema } from "mongoose";

// define schema
const likeSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

// config when user object is convert to JSON format
likeSchema.set("toJSON", {
  transform: (_doc, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
  }
});

// define model
const Like = model("Like", likeSchema);

export default Like;
