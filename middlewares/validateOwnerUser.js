import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";

const MODELS = {
  posts: Post,
  comments: Comment,
  likes: Like
};

async function validateOwnerUser(req, res, next) {
  const { userId } = req;
  const { id: docId } = req.params;

  try {
    // get path from request object
    const path = req.baseUrl.split("/")[2]; // ej: posts
  
    const Model = MODELS[path];
  
    // get doc from database
    const docResponse = await Model.findById(docId);
    
    // delete las letter of path
    const nameDoc = path.slice(0, -1);
  
    // handle docId does not match any doc
    if(!docResponse) return res.status(404).json({ message: `${nameDoc} not found` });
  
    const doc = docResponse.toJSON();
  
    // validate user is owner of doc
    if(!doc.user.equals(userId)) return res.status(401).json({
      message: `This ${nameDoc} belongs to another user`
    });
  
    // add data to request object
    req[nameDoc] = doc;

    next();
  }catch(err) {
    next(err);
  }
}

export default validateOwnerUser;
