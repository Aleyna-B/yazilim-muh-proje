import axios from 'axios';

const API = axios.create({
  baseURL: 'https://b1c6-212-253-113-109.ngrok-free.app/', // Change to your Flask IP and port
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
});

// Handle CORS
API.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

export default API;
