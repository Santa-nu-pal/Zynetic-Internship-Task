const express = require('express');/*We import Express, the web framework you're using to build your API.
This gives us access to things like Router, app, etc. */

const { signup, login } = require('../controllers/authController');//This line is using destructuring to import two functions: signup and login from the 
// authController.js file. These are controller functions that handle what happens when a user signs up or logs in
//  (like saving to the database, returning a token, etc.).
const router = express.Router();/* This creates a new router object.

Think of it like a mini version of your Express app where you can attach routes (POST, GET, etc.).

It helps keep your code modular and clean. */

router.post('/signup', signup);/* Defines a POST route at /signup.

When a client sends a POST request to /signup, it will run the signup function from your controller.

This is typically used to register a new user. */

router.post('/login', login);/* Defines another POST route at /login.

When someone logs in (providing email and password), this route will trigger the login function from the controller. */

module.exports = router;/* This exports the router so it can be imported and used in your main server file (like app.js or server.js). */
