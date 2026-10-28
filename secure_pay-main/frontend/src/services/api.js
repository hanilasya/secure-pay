import axios from 'axios';

// Ensure global withCredentials is set
axios.defaults.withCredentials = true;

// Create Axios instance with cookie credentials enabled
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Enables sending and receiving session cookies (connect.sid)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network or server error occurred.';
    
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

// Authentication & Session Endpoints
export const authAPI = {
  getMe: () => api.get('/api/me'),
  login: (email, password) => api.post('/api/login', { email, password }),
  logout: () => api.post('/api/logout'),
  register: (name, email, password, role) =>
    api.post('/api/auth/register', { name, email, password, role }),
};

// Customer Portal Endpoints
export const customerAPI = {
  getProfile: () => api.get('/api/customer/profile'),
};

// Payment Application Endpoints
export const paymentAPI = {
  getPayments: () => api.get('/api/payments'),
  createPayment: (amount, recipient, description) =>
    api.post('/api/payment', { amount, recipient, description }),
};

// Admin Portal Endpoints
export const adminAPI = {
  getDashboard: () => api.get('/api/admin'),
  getLogs: (params) => api.get('/api/logs', { params }),
  getUsers: () => api.get('/api/admin/users'),
};

export default api;
