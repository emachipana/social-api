import { model, Schema } from "mongoose";

// define schema
const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  photo: {
    public_id: String,
    url: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Like"
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  date: {
    type: Date,
    required: true
  }
});

// config when user object is convert to JSON format
postSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    if(!doc.photo.public_id) {
      returnedObject.photo = {};
    }
  }
});

// define model
const Post = model("Post", postSchema);

export default Post;
