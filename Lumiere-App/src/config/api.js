// src/config/api.js
// API configuration for connecting to the shared backend

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your backend URL
// For development with Expo Go, use your computer's local IP (not localhost)
// For web browser, use localhost
// Example: 'http://192.168.1.100:5000'
const API_BASE_URL = __DEV__ 
  ? (typeof window !== 'undefined' 
      ? 'http://localhost:3000' // Web browser - use localhost
      : 'http://192.168.137.237:3000') // Mobile device - use local IP
  : 'https://api.lumiere-patisserie.com'; // Production URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };

