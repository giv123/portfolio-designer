// src/api/Client.js
import axios from 'axios';

const client = axios.create({
  baseURL: '/api', // Adjust this to your backend API base URL
  timeout: 5000,   // Optional: set a timeout for requests
});

export default client;