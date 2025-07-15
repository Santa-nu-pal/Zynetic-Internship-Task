const jwt = require('jsonwebtoken');//We use this to verify the JWT token passed in the request header.
const User = require('../models/User');// This imports the User model, which we use to retrieve the user details from the database 
// using the user ID embedded in the JWT token.

/**
 * Authentication Middleware
 * -------------------------
 * This middleware function is used to protect routes by verifying the JWT token
 * provided in the request's Authorization header. If a valid token is present,
 * it decodes the token, retrieves the corresponding user from the database
 * (excluding the password), and attaches the user object to the request (`req.user`).
 * 
 * If no token is found or the token is invalid/expired, it sends a 401 Unauthorized
 * response, preventing access to the protected route.
 * 
 * Usage: Add this middleware to routes that require user authentication.
 */

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];/* req.headers.authorization: The Authorization header in the request is where the client sends the token.
  .split(' ')[1]: The token is usually passed in the format Bearer <token>, so we split the header at the space and get the token (which is at index 1). */

  if (!token) return res.status(401).json({ message: 'Access Denied' });/*If no token is provided, we immediately send a 401 Unauthorized response with the message "Access Denied".
  This means that the user is not authenticated, and they cannot access the protected resource.*/
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);/* jwt.verify(token, process.env.JWT_SECRET): This function verifies that the 
    provided token is valid and has not expired.

    It checks if the token is signed with the correct secret key (process.env.JWT_SECRET).
    
    If valid, it decodes the token and gives us the payload (which contains the user ID in this case).
    
    If the token is invalid or expired, an error will be thrown, and we catch it later in the catch block. */

    req.user = await User.findById(decoded.id).select('-password');/* Finds the user by their ID (decoded from a token), excludes the password field from the result,
    and assigns the user object to req.user for use in the next middleware or route handler. */
    next(); //  Pass control to the next middleware or the actual route handler
  } catch {
    res.status(401).json({ message: 'Invalid Token' });//else if there is an error in the token then the catch bloack cathes it and send the 401 response with the message 'Invalid Token'
  }
};
