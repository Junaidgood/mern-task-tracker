import mongoose from 'mongoose';

// User Schema: User ka structure aur validation rules
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add honge
  }
);

// User Model: MongoDB 'users' collection se baat karne ke liye
const User = mongoose.model('User', userSchema);

export default User;
