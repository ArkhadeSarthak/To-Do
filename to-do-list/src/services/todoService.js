import axios from 'axios';

// Get API URL from Vite environment variables (fallback to localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api/todos`,
  headers: {
    'Content-type': 'application/json'
  }
});

const getTodos = async (email) => {
  if (!email) return [];
  const response = await apiClient.get('/', {
    params: { email }
  });
  return response.data;
};

const createTodo = async (todoData) => {
  const response = await apiClient.post('/', todoData);
  return response.data;
};

const updateTodo = async (id, todoData) => {
  const response = await apiClient.put(`/${id}`, todoData);
  return response.data;
};

const deleteTodo = async (id, email) => {
  const response = await apiClient.delete(`/${id}`, {
    params: { email }
  });
  return response.data;
};

const todoService = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};

export default todoService;
