import axios from 'axios';

// Default to relative /api which Vite proxies to Spring Boot (http://localhost:8080)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to inject Authorization token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and diagnostic messaging
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.response = {
        data: {
          message: 'Cannot connect to backend server. Please verify Spring Boot is running on port 8080!',
        },
      };
    } else if (error.response) {
      const data = error.response.data;
      if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
        error.response.data = {
          message: 'Backend endpoint returned HTML 404. Verify endpoint path on http://localhost:8080.',
        };
      } else if (data && typeof data === 'object') {
        if (!data.message) {
          if (data.error) {
            data.message = data.error;
          } else if (data.detail) {
            data.message = data.detail;
          } else if (data.errors && typeof data.errors === 'object') {
            data.message = Object.values(data.errors).join(', ');
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
