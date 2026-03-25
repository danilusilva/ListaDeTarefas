import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Injeta o token automaticamente em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login    = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/registrar', data);

export const getTasks = () => api.get('/api/Tarefa');
export const createTask = (data) => api.post('/api/Tarefa', data);
export const updateTask = (id, data) => api.put(`/api/Tarefa/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/Tarefa/${id}`);
