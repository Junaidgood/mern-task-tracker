const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_task_tracker';

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes);

// Root test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Tracker API is active and ready!' });
});

// Error handling middlewares (Routes ke baad aani chahiyen)
app.use(notFound);
app.use(errorHandler);

// Database Connection & Server Listening
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
