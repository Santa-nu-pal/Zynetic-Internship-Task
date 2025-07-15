const jwt = require('jsonwebtoken');/* This module helps in signing and verifying JWT tokens. 
We use it to create a token when a user logs in or signs up. The token is used to authenticate the user in future requests. */
const User = require('../models/User');//This imports the User model that we defined earlier in User.js to interact with the User collection in MongoDB.

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
/* generateToken(id): This function generates a JWT.

id: The ID of the user is passed, and this ID is encoded into the token.

process.env.JWT_SECRET: A secret key used to sign the token. It is stored in your environment variables to keep it secure and not hardcoded.

expiresIn: '1d': This specifies that the token will expire in 1 day.

This token will be sent to the user on successful login or signup and will be used to verify the user's identity on subsequent requests. */

exports.signup = async (req, res) => {
  const { email, password } = req.body;//User Data (email, password) is extracted from the request body (req.body).
  try {
    const userExists = await User.findOne({ email });//find the user by his/her email
    if (userExists) return res.status(400).json({ message: "User already exists" });
    /* We use User.findOne({ email }) to see if a user with the same email already exists.

    If the user exists, we send a 400 response (Bad Request) with a message "User already exists". */

    const user = await User.create({ email, password });/* If the user doesn't exist, we create a new user using User.create({ email, password }). 
    The password will be automatically hashed (thanks to the pre('save') function in the User.js file in the models folder). */
    const token = generateToken(user._id);/* After the user is created, we call generateToken(user._id) to 
    create a token with the newly created user's ID. */
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;//User Data (email, password) is extracted from the request body (req.body).
  try {
    const user = await User.findOne({ email });//We use User.findOne({ email }) to search for the user by email in the database.
    if (!user || !(await user.matchPassword(password)))//If the user doesn’t exist or the password doesn’t match, return a 401 status 
    // (Unauthorized) with the message "Invalid credentials".
    return res.status(401).json({ message: "Invalid credentials" });/* If the user exists, we use the matchPassword() method (from User.js) 
    to check if the password entered matches the hashed password stored in the database. */
    
    const token = generateToken(user._id);//If the credentials are correct, we generate a new JWT token with the user's ID.
    res.json({ token });//The token is sent back to the user in the response.
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

/* What happens after signup?
The user receives a JWT token, which they can use for subsequent requests that require authentication. */