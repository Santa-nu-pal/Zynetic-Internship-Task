
const { body } = require('express-validator');
const express = require('express');
const auth = require('../middleware/auth');
const {
  createBook, getBooks, getBookById, updateBook, deleteBook
} = require('../controllers/bookController');

const router = express.Router();

router.use(auth); // all routes protected

router.post('/',
    [
      body('title').notEmpty(),
      body('author').notEmpty(),
      body('category').notEmpty(),
      body('price').isNumeric().notEmpty(),
      body('rating').isNumeric().optional(),
      body('published_date').isISO8601().toDate().optional()
    ],
    createBook
  );
  
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;