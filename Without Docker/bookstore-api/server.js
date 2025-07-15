const express = require('express');//Imports the Express framework to handle HTTP requests, define routes, middleware, etc.
const mongoose = require('mongoose');//Used to interact with MongoDB in an object-oriented way.
const dotenv = require('dotenv');//Loads environment variables from a .env file into process.env.
dotenv.config();//This line ensures any environment variables you define in .env (like PORT, MONGO_URL, JWT_SECRET, etc.)
//  are loaded and accessible via process.env.

const app = express(); // You’re initializing the Express app so you can use it to define middleware, routes, and start the server.
// 🟢 make sure this is before app.use
app.use(express.json());//This middleware automatically parses incoming JSON payloads and attaches them to req.body.
// Without this, you'd get undefined when trying to access POST body data.

const PORT = process.env.PORT || 5000;//Tries to get PORT from .env; if not found, defaults to 5000.

// 🛣️ Routes
const authRoutes = require('./routes/authRoutes');//are used to import code from other files (authRoutes.js and bookRoutes.js) 
const bookRoutes = require('./routes/bookRoutes');// that contain specific sets of routes.
/* Why "modular"?
Instead of writing all your routes in one huge file (which gets messy), we split them into smaller files (modules) 
— one for authentication (signup, login) 
and another for books (create, get, delete). */

app.use('/api/auth', authRoutes);//any request that we'll send to /api/auth route will be redirected to the authRoutes routes file
app.use('/api/books', bookRoutes);// and any request that we'll send to /api/books route will be redirected to the bookRoutes routes file

// 🛢️ MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => {/* Connects to your MongoDB database using the URL defined in .env (e.g., mongodb+srv://...). */
  console.log("✅ MongoDB connected");//Logs that MongoDB is connected.
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));//Starts the Express server so it can listen for incoming HTTP requests.
}).catch((err) => console.error("❌ MongoDB connection error:", err));//If MongoDB fails to connect, logs the error and does not start the server.


app.get("/", (req, res) => {//A simple GET route for / (homepage) just to confirm the API is working.
    res.send("Bookstore API is live");
  });
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);/* Catches and handles any errors thrown inside routes or controllers.
  Sends back a structured JSON error response with status code.
  It must be placed after all routes so that unhandled errors bubble up to it. */
    
