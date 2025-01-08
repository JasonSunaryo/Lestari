import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Your backend is running on port 5000
  timeout: 10000,
  withCredentials: true
});

export default api;