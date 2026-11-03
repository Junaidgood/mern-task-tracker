// Middleware: Check karta hai ke user logged in hai ya nahi
const protect = (req, res, next) => {
  // 1. Check if session exists and contains a userId
  if (req.session && req.session.userId) {
    return next(); // User verified hai, request ko aage controller tak jane do
  }

  // 2. Agar session ya userId nahi hai to block kar do
  res.status(401).json({ message: 'Not authorized, please login' });
};

module.exports = { protect };
