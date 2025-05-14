import axios from 'axios';

const API = axios.create({
  baseURL: 'https://192.168.1.37:5000/', // Change to your Flask IP and port
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
