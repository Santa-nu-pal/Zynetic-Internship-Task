const Book = require('../models/Book');//The Mongoose model used to interact with the books collection in MongoDB.
const { validationResult } = require('express-validator');/* A function from express-validator that collects and checks for any validation errors from 
the request (e.g., missing fields, incorrect formats). express-validator is a Node.js middleware library that helps you validate and sanitize user 
input in your Express apps.*/

exports.createBook = async (req, res) => {//Creates a new book in the database.
  const errors = validationResult(req);//Check for validation errors (from middleware).
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });//If errors exist → respond with 400 and the error list.

  try {//if no errors are found then
    const book = await Book.create(req.body);//Create the book using Book.create(req.body).
    res.status(201).json(book);//Respond with 201 Created and return the book data.
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err.message });//If creation fails → send a 400 error with the failure message.
  }
};


exports.getBooks = async (req, res) => {//Fetches a list of books from the database with optional filtering, pagination, and sorting.
  try {
    const { author, category, rating, title, page = 1, limit = 10, sort, order = 'asc' } = req.query;//This reads query parameters from the URL 
    let query = {};/* Creates an empty object to store search filters (like author, category, etc.)
      Later, we’ll fill this query with conditions like { author: /JK/i }.
       */

    if (author) query.author = { $regex: author, $options: 'i' };//If the user sent an author, we search books with that name (case-insensitive using regex).
    if (category) query.category = { $regex: category, $options: 'i' };//Same goes for category.
    if (rating) query.rating = { $gte: Number(rating) }; //For rating, it searches for books with rating greater than or equal to the given value.
    if (title) query.title = { $regex: title, $options: 'i' };//Same goes for title.

    const skip = (Number(page) - 1) * Number(limit);/* For pagination: if page is 2 and limit is 10 → skip = (2-1)*10 = 10 → skips first 10 books.
      This helps return only the books for the selected page. */

    // Default: no sorting
    let sortOption = {};//Prepares an object to define how the books should be sorted (like by price or rating).

    /* If user wants to sort by price or rating → store the sorting order in sortOption.
    -1 = descending, 1 = ascending. */
    if (sort === 'price' || sort === 'rating') {/* if the user sends: /books?sort=price&order=desc
        then the resultant sort option becomes:- sortOption = { price: -1 }; 
        This sortOption object is later passed into:
        .sort(sortOption)
        Which tells MongoDB to sort results by that field and direction.*/
      sortOption[sort] = order === 'desc' ? -1 : 1;
    }

    const books = await Book.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOption);
    /* This is the main DB query:

      .find(query) filters the books
      
      .skip(skip) skips certain records (for pagination) by using the above 'skip' constant that was created
      
      .limit(Number(limit)) limits how many results to return
      
      .sort(sortOption) sorts the results by using the 'sortOption' variable that was created above*/

    const total = await Book.countDocuments(query);/* Counts total number of books matching the filters (without skip/limit).
      Used to calculate total number of pages. */

    res.json({
      totalResults: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      resultsPerPage: Number(limit),
      books,
    });
    /* sends a JSON response back to the client with:

    total number of matching books

    current page

    total pages

    how many books per page

actual book data 


🧪 Suppose this scenario:
You have 35 books in total in your MongoDB that match the user's filter.

The user sends this API request:

GET /books?page=2&limit=10
This means: “Give me the 2nd page of books, and I want 10 books per page.”

🔢 What the code will calculate:
totalResults = 35 → 35 matching books total

currentPage = 2 → because the user asked for page 2

resultsPerPage = 10 → user asked for 10 per page

totalPages = Math.ceil(35 / 10) = 4 → total of 4 pages (last page has 5 books)

books = [...] → array of 10 book objects returned from MongoDB for page 2

📦 So, the response sent to the frontend will look like this:

json
{
  "totalResults": 35,
  "currentPage": 2,
  "totalPages": 4,
  "resultsPerPage": 10,
  "books": [
    {
      "_id": "abc123",
      "title": "Book 11",
      "author": "Author A",
      "category": "Fiction",
      "price": 199,
      "rating": 4.5,
      "published_date": "2024-01-10T00:00:00.000Z"
    },
    {
      "_id": "abc124",
      "title": "Book 12",
      ...
    }
    // up to Book 20
  ]
}*/
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });//If any error happens during the process, it catches it and returns an error response.
  }
};




exports.getBookById = async (req, res) => {//Gets a single book by its ID.
  try {
    const book = await Book.findById(req.params.id);//Used Book.findById(req.params.id) to fetch the book.
    if (!book) return res.status(404).json({ message: "Not found" });//If input format is good and not found → respond with 404.
    res.json(book);//If input format is good found → respond with the book data.
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });//If ID is invalid(i.e the input format is
    // bad then) → respond with 400 and error message.
  }
};

exports.updateBook = async (req, res) => {//Updates a book by its ID.
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });/* Finds a book by its ID from the URL (req.params.id), 
  updates it with the data from req.body,
 and returns the updated document (not the original one) because of { new: true } option. */
  if (!book) return res.status(404).json({ message: "Book not found" });//If book not found → respond with 404.
   res.json(book);// If successful → respond with updated book data.
};

exports.deleteBook = async (req, res) => {//Deletes a book by its ID.
  const book = await Book.findByIdAndDelete(req.params.id);//Use findByIdAndDelete to remove the book.
  if (!book) return res.status(404).json({ message: "Book not found" });//If not found → respond with 404.
  res.json({ message: "Book deleted" });//If successful → respond with { message: "Book deleted" }.
};
