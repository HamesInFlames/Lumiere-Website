// src/lib/config.js
// Configuration for different environments

// API base URL - in production, this should be your Railway backend URL
// In development, Vite proxy handles /api requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper to build API endpoints
export function apiUrl(path) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
