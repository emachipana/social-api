import Post from "../models/Post.js";

async function validateOwnerUser(req, res, next) {
  const { userId } = req;
  const { id: postId } = req.params;

  // get post from database
  const responsePost = await Post.findById(postId);
  
  // handle postId does not match any doc
  if(!responsePost) return res.status(404).json({ message: "Post not found" });

  const post = responsePost.toJSON();

  // validate user is owner of post
  if(!post.user.equals(userId)) return res.status(401).json({
    message: "This post belongs to another user"
  });

  // add data to request object
  req.post = post;

  next();
}

export default validateOwnerUser;
