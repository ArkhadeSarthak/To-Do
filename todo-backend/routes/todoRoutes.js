const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

// GET all todos
router.get('/', getTodos);

// POST a new todo
router.post('/', createTodo);

// PUT update a todo by ID
router.put('/:id', updateTodo);

// DELETE a todo by ID
router.delete('/:id', deleteTodo);

module.exports = router;
