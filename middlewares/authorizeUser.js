import jwt from "jsonwebtoken";

function authorizeUser(req, res, next) {
  // get header authorization
  const authorization = req.get("authorization");

  // get token and handle authorization undefined
  const token = authorization?.split(" ")[1];

  // decode token with  json web token
  const decodedToken = token 
    ? jwt.verify(token, process.env.TOKEN_SECRET)
    : {};

  // handle token no provided
  if(!decodedToken.id) return res.status(401).json({
    message: "Acces denied, token missing"
  });

  // get user id from decoded token
  const { id: userId } = decodedToken;

  // add userId key to request object
  req.userId = userId;

  next();
}

export default authorizeUser;
