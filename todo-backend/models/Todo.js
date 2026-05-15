const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  Date: {
    type: String,
  },
  List: {
    type: String,
  },
  Description: {
    type: String,
  },
  Checked: {
    type: Boolean,
    default: false,
  },
  userEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', todoSchema);
