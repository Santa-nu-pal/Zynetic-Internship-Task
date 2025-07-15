#  Book Store API

This is a RESTful API for managing books in a bookstore. The API allows users to create, read, update, and delete books, along with features like pagination, sorting, authentication, and Docker support.

---

##  Local API URL

You can test the Local live using the following URL:


http://localhost:5000/api/books/

---

##  Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Postman (for testing)
- JWT Authentication

---
## Code Readability
I’ve added clear and concise comments throughout the codebase wherever necessary.
This helps in understanding the flow, functionality, and purpose of various parts of the project, making it easy for others to read, review, and maintain the code.


##  Authentication

All routes are protected. Use the login/signup endpoints to get a token and add it to headers like: Authorization: Bearer <your_token>

---

##  How to Use (Locally)

1. Clone the repo
2. Run `npm install`
3. Set your `.env` file
4. Start using: npm start


--------------------------------------------------------------------------------------------------------------------------------------


API Endpoints:-

 - Register a User -> POST /api/auth/register
  - Body: 
          {
             "email": "testuser@gmail.com",
             "password": "testuser"
          }
----------------------------------------------------

Login a User:- 

 -POST /api/auth/login
    Body: 
          {
             "email": "testuser@gmail.com",
             "password": "testuser"
          }
    Response: Returns JWT token which you have to add to the bearer Authorization
------------------------------------------------

 -Get All Books (with Pagination & Sorting)
    GET /api/books?page=1&limit=5&sort=price&order=asc(write this if you want to get the 1st page with 5 books sorted in ascending order by Price field)

Query Params:-

page (default: 1)

limit (default: 10)

sort: price or rating
-------------------------------

 -Get Book by ID
     GET /api/books/:id
-------------------------------

  -Create a Book
     POST /api/books
     Format {
            "Title": "Title",
            "Author": "name",
            "Category": "category",
            "Price": numeric value,
            "Rating": 4.5,
            "Published_Date": "2003-03-18"
            }

     Headers:-
     Authorization: Bearer <your_token>

------------------------------------------------

    -Update a Book
            PUT /api/books/:id
    
------------------------------------------------

    -Delete a Book
            DELETE /api/books/:id

------------------------------------------------a


 Project Structure

  bookstore-api
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
└── server.js


        
Sample books that are added are

        {
            "_id": "6813956c9baaf78845cab4a9",
            "title": "Harry Potter",
            "author": "J.K. Rowling",
            "category": "Fantasy",
            "price": 499,
            "rating": 4.8,
            "published_date": "2001-06-26T00:00:00.000Z",
            "__v": 0
        },
        {
            "_id": "681395c99baaf78845cab4af",
            "title": "The Hobbit",
            "author": "J.R.R. Tolkien",
            "category": "Fantasy",
            "price": 349,
            "rating": 4.7,
            "published_date": "1937-09-21T00:00:00.000Z",
            "__v": 0
        },
        {
            "_id": "681395da9baaf78845cab4b2",
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "category": "Classic",
            "price": 299,
            "rating": 4.9,
            "published_date": "1960-07-11T00:00:00.000Z",
            "__v": 0
        },
        {
            "_id": "681395e79baaf78845cab4b5",
            "title": "1984",
            "author": "George Orwell",
            "category": "Dystopian",
            "price": 259,
            "rating": 4.6,
            "published_date": "1949-06-08T00:00:00.000Z",
            "__v": 0
        },
        {
            "_id": "681395f39baaf78845cab4b8",
            "title": "The Da Vinci Code",
            "author": "Dan Brown",
            "category": "Thriller",
            "price": 399,
            "rating": 4.5,
            "published_date": "2003-03-18T00:00:00.000Z",
            "__v": 0
        }