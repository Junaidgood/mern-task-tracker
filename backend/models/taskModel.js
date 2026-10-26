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
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Model: constructor compiled from Schema definitions; works with the collection
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
