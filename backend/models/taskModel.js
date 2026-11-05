const mongoose = require('mongoose');

// Schema: defines the shape of documents within the 'tasks' collection
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // Nayi Field: Task ka maalik (Owner)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Model: constructor compiled from Schema definitions; works with the collection
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
