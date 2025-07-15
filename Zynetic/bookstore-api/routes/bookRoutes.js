
const { body } = require('express-validator');
const express = require('express');
const auth = require('../middleware/auth');
const {
  creating_a_newbook, get_books, get_book_by_id, update_book, delete_book
} = require('../controllers/bookController');

const router = express.Router();

router.use(auth);//written this just t make sure that all the routes are protected

router.post('/',
    [//adding all the constraints so that nooone can ad unuseful infomation to my dataabse
      body('title').notEmpty(),
      body('author').notEmpty(),
      body('category').notEmpty(),
      body('price').isNumeric().notEmpty(),
      body('rating').isNumeric().optional(),
      body('published_date').isISO8601().toDate().optional()
    ],
    creating_a_newbook
  );
  
router.get('/', get_books);
router.get('/:id', get_book_by_id);
router.put('/:id', update_book);
router.delete('/:id', delete_book);

module.exports = router;