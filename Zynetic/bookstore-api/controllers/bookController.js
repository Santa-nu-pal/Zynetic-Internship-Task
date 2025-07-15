const Book = require('../models/Book');
const { validationResult  } = require('express-validator');

exports.creating_a_newbook = async (req, res) => {
    const errors = validationResult (req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
  
    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ message: "Book creationn failed", error: err.message });
    }
  };
  

  exports.get_books = async (req, res) => {
    try {
      const { author, category, rating, title, page = 1, limit = 10, sort, order = 'asc' } = req.query;//extracting everything from the query itself
      //andd also setting the default values for some constants( i mean the author,category those variables)
      let query = {};
  
      if (author) query.author = { $regex: author, $options: 'i' };
      if (category) query.category = { $regex: category, $options: 'i' };
      if (rating) query.rating = { $gte: Number(rating) }; // greater than or equal to cnstraint so that only the books with rating grater than the inputted one shows
      if (title) query.title = { $regex: title, $options: 'i' };
  
      const skip = (Number(page) - 1) * Number(limit);
  
     
      let sorting_preference = {};//by default we are setting this option to be empty 
  
      if (sort === 'price' || sort === 'rating') {
        sorting_preference[sort] = order === 'desc' ? -1 : 1;
      }
  
      const books = await Book.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort(sorting_preference);
  
      const total = await Book.countDocuments(query);
  
      res.json({
        totalnumberof_results: total,
        current_page: Number(page),
        total_pages: Math.ceil(total / Number(limit)),
        results_per_page: Number(limit),
        books,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  
  

exports.get_book_by_id = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID! Book Not Found!", error: err.message });
  }
};

exports.update_book = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: "Book not found!!!" });
  res.json(book);
};

exports.delete_book = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found!!" });
  res.json({ message: "Book deleted successfully!" });
};
