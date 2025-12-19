import axios from 'axios';
import useStore from '../store/useStore.js';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 60000, // Increased to 60 seconds for AI analysis
});

api.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.code === 'ECONNABORTED') {
      console.error("Request timed out! The AI took too long.");
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;