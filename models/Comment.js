import { model, Schema } from "mongoose";

// define schema
const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: String,
    required: true
  }
});

// config when user object is convert to JSON format
commentSchema.set("toJSON", {
  transform: (_doc, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// define model
const Comment = model("Comment", commentSchema);

export default Comment;
