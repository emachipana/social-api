import { model, Schema } from "mongoose";

// define schema
const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  photo: String, 
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Like"
  }],
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

// config when user object is convert to JSON format
postSchema.set("toJSON", {
  transform: (_doc, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
  }
});

// define model
const Post = model("Post", postSchema);

export default Post;
