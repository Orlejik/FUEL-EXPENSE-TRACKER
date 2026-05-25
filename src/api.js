import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (email, password) => api.post('/auth/signup', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
//   login: (email, password) => {
//   const formData = new URLSearchParams();

//   formData.append('username', email);
//   formData.append('password', password);

//   return api.post('/auth/login', formData, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });
// },
  getMe: () => api.get('/auth/me'),
};

export const vehicleService = {
  getVehicles: () => api.get('/vehicles/'),
  getVehicle: (id) => api.get(`/vehicles/${id}`),
  createVehicle: (data) => api.post('/vehicles/', data),
  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
};

export const expenseService = {
  getExpenses: (vehicleId) => api.get('/expenses/', { params: { vehicle_id: vehicleId } }),
  getExpense: (id) => api.get(`/expenses/${id}`),
  createExpense: (data) => api.post('/expenses/', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getVehicleStats: () => api.get('/expenses/stats/vehicle-stats'),
  getTotalSpent: () => api.get('/expenses/stats/total-spent'),
};
