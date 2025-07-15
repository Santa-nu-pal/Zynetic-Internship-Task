const mongoose = require('mongoose');/* mongoose: This module helps you interact with MongoDB. 
It allows you to define schemas (structures) for your data and interact with MongoDB using those schemas.
Mongoose is an Object Data Modeling (ODM) library for MongoDB, specifically designed for use with Node.js. It provides a higher-level abstraction for 
interacting with a MongoDB database, making it easier for developers to work with data using JavaScript.  */

const bookSchema = new mongoose.Schema({/* This is the Book Schema, where we define the structure of a Book object.
  The data types (e.g., String, Number, Date) are provided by Mongoose to ensure the correct format for each field. */
  title: String,
  author: String,
  category: String,
  price: Number,
  rating: Number,
  published_date: Date,
});

module.exports = mongoose.model('Book', bookSchema);/* This line exports the Book model.
mongoose.model('Book', bookSchema) creates a Mongoose model called Book that is tied to the bookSchema.
By using module.exports, this model can now be used in other parts of the project (e.g., in controllers or routes). */
