const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;


const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// making the mongodb connection here
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(" MongoDB Successfully Connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
    res.send("Bookstore API is live and running");
  });
  
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);
    
