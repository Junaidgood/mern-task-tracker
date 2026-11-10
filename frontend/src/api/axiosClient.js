import axios from 'axios';

// Shared Axios client with credentials (cookies) enabled
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Har request ke sath browser ki session cookie sath bhejta hai
});

export default axiosClient;
