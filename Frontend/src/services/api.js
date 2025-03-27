import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust as necessary

export const loginUser = async (email, password) => {
  return axios.post(`${API_BASE_URL}/login`, { email, password });
};

// more API.
