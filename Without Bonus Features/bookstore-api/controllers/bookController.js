const Book = require('../models/Book');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
  
    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ message: "Create failed", error: err.message });
    }
  };
  

exports.getBooks = async (req, res) => {
    try {
      const { author, category, rating, title } = req.query;
      let query = {};
  
      if (author) query.author = { $regex: author, $options: 'i' };
      if (category) query.category = { $regex: category, $options: 'i' };
      if (rating) query.rating = { $gte: Number(rating) };
      if (title) query.title = { $regex: title, $options: 'i' }; // partial match
  
      const books = await Book.find(query);
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book deleted" });
};
