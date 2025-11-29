// src/store/authStore.js
// Zustand store for authentication state

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // Initialize auth state from storage
  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth init error:', error);
      set({ isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data); // Debug log
      
      // Handle both response formats
      const data = response.data;
      const user = data.user || data;
      const token = data.token;

      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const message = error.response?.data?.message || error.message || 'Login failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
      return { success: false, message };
    }
  },

  // Signup
  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/signup', data);
      console.log('Signup response:', response.data); // Debug log
      
      // Handle both response formats
      const responseData = response.data;
      const user = responseData.user || responseData;
      const token = responseData.token;

      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error); // Debug log
      const message = error.response?.data?.message || error.message || 'Signup failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
      return { success: false, message };
    }
  },

  // Logout
  logout: async () => {
    try {
      // Clear storage first
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // Clear state - this will trigger navigation reset via RootNavigator key
      set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if storage fails
      set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  },

  // Check if user is pastry chef
  isPastryChef: () => {
    const { user } = get();
    return user?.role === 'pastry_chef';
  },

  // Check if user is barista
  isBarista: () => {
    const { user } = get();
    return user?.role === 'barista';
  },
}));

