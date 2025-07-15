const mongoose = require('mongoose');//Used to interact with MongoDB
/* It allows you to define schemas (structures) for your data and interact with MongoDB using those schemas.
Mongoose is an Object Data Modeling (ODM) library for MongoDB, specifically designed for use with Node.js. It provides a higher-level abstraction for 
interacting with a MongoDB database, making it easier for developers to work with data using JavaScript. */

const bcrypt = require('bcryptjs');//Used to hash passwords and compare them securely.

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },//email: Must be provided and must be unique.
  password: { type: String, required: true }//this indicates that password is also required and it must be string type
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);/* This is a pre-save middleware.  It runs before saving a user to the database.
  It checks: "Has the password been changed?" (change in the sense that if the user is logging up in the platform then that password
  will be considered as changed but if the user is logging in then it will not be hased but if the user updated his/her password then that password
  will be considered as changed and will be hashed again) 
  If not → it skips hashing.  
  If yes → it hashes the password using bcrypt.hash() with 10 salt rounds.  
  So, even if someone opens your database, they can’t see the actual password—only the hash. */
  next();//next() means: "I’ve done my job — please move to the next step!✅"
});

userSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};
/* userSchema.methods is where you define custom functions that every user document (like const user = await User.findOne(...)) can use.
So matchPassword() becomes a function that each user object (document) can call.
Note: To use this method in other files (e.g., during login validation), 
you need to import this User model using:
const User = require('./models/user'); 
(or the correct relative path depending on your file structure).*/

module.exports = mongoose.model('User', userSchema);
/* This exports the model so you can use it elsewhere in your project, like in routes or controllers. */