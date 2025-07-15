
const { body } = require('express-validator');/* express-validator is used to validate and sanitize incoming data.
Here, we’re importing the body function to validate fields in req.body. */

const express = require('express');
const auth = require('../middleware/auth');/* This brings in your custom auth.js middleware.
It checks for a valid JWT token before allowing access to protected routes. */

const {
  createBook, getBooks, getBookById, updateBook, deleteBook
} = require('../controllers/bookController');/* This imports the main logic functions for books from your bookController.js.
Each function handles a specific operation (Create, Read, Update, Delete = CRUD).*/

const router = express.Router();/* This creates a new router object.

Think of it like a mini version of your Express app where you can attach routes (POST, GET, etc.).

It helps keep your code modular and clean. */

router.use(auth); // This line applies the auth middleware function to every route that comes after it in the file. That means:
/*  Now all routes like:
router.post('/', ...);
router.get('/', ...);
router.get('/:id', ...);
router.put('/:id', ...);
router.delete('/:id', ...); 
are protected — they will first go through the auth middleware before reaching the actual controller (like createBook, getBooks, etc).

🧪 Why use router.use(auth) instead of adding auth to every route?
It's just cleaner and more efficient. 
Instead of:
router.get('/', auth, getBooks);
router.post('/', auth, createBook);

You do it once:
router.use(auth);
Now all following routes are protected automatically.*/

router.post('/',
    [
      body('title').notEmpty(),
      body('author').notEmpty(),
      body('category').notEmpty(),
      body('price').isNumeric().notEmpty(),
      body('rating').isNumeric().optional(),
      body('published_date').isISO8601().toDate().optional()
    ],
    createBook// If all validations pass → createBook is called
  );
  
router.get('/', getBooks);/* Defines GET /books route.
It will call the getBooks controller to fetch books (with filters, pagination, etc.). */

router.get('/:id', getBookById);/* Defines GET /books/:id
It extracts the id from URL and calls getBookById. */

router.put('/:id', updateBook);/* Defines PUT /books/:id
Used to update a book by ID. */

router.delete('/:id', deleteBook);/* Defines DELETE /books/:id
Deletes a book by its ID. */

module.exports = router;/* This exports the router so it can be used in app.js like:

const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes); that means whenever we'll send request to the route begining with /books it will redirect to the bookRoutes routes*/