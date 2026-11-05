// 404 Not Found Middleware (Agar koi aisi URL hit kare jo exist nahi karti)
const notFound = (req, res, next) => {
  res.status(404).json({
    message: `Not Found - Route [${req.method}] ${req.originalUrl} does not exist`,
  });
};

// Centralized Error Handling Middleware
// Jab bhi kisi controller me next(error) call hoga, Express yahan aayega
const errorHandler = (err, req, res, next) => {
  // Agar Mongoose ka invalid ObjectId error ho (e.g. galat ID format)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // Agar Mongoose Schema Validation fail ho jaye (e.g. title missing)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Default status code 500 (Internal Server Error)
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = { notFound, errorHandler };
