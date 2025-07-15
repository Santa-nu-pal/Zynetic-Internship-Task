const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express(); // 🟢 make sure this is before app.use
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 🛣️ Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// 🛢️ MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => console.error("❌ MongoDB connection error:", err));


app.get("/", (req, res) => {
    res.send("Bookstore API is live 📚");
  });
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);
    
