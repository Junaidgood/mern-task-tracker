import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_task_tracker';

// 1. CORS Middleware (Cookies allow karne ke liye specific origin aur credentials zaroori hain)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// 2. Body Parser (JSON text ko object me badalta hai)
app.use(express.json());

// 3. Session Middleware (express-session + connect-mongo)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mern_task_tracker_secret_key',
    resave: false,
    saveUninitialized: false,
    store: (MongoStore.create ? MongoStore : (MongoStore.MongoStore || MongoStore.default)).create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true, // Client-side JS cookie read nahi kar sakta (XSS protection)
      secure: false,  // Development me HTTPS nahi hota isliye false
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 din tak session chalega
    },
  })
);

// 4. API Routes
app.use('/api/auth', authRoutes);
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
