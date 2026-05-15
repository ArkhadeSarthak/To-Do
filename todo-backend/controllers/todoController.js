const Todo = require('../models/Todo');

// @desc    Get all todos for a specific user
// @route   GET /api/todos
const getTodos = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'User email is required to fetch tasks' });
    }
    const todos = await Todo.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
const createTodo = async (req, res) => {
  try {
    if (!req.body.userEmail) {
      return res.status(400).json({ message: 'User email is required to create a task' });
    }
    const newTodo = await Todo.create(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
};

// @desc    Update a todo (only if it belongs to the user)
// @route   PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required to update a task' });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userEmail: userEmail },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
};

// @desc    Delete a todo (only if it belongs to the user)
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query; // Expect email in query for DELETE

    if (!email) {
      return res.status(400).json({ message: 'User email is required to delete a task' });
    }

    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userEmail: email });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    res.status(200).json({ message: 'Todo deleted successfully', id: deletedTodo._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
