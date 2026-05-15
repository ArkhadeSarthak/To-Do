import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user`;

const getUserProfile = async (email) => {
  const response = await axios.get(`${API_URL}/profile/${email}`);
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData);
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
};
