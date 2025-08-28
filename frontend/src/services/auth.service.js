// src/services/auth.service.js
import axios from 'axios';
import BASE_URL from '../apiConfig';

const API = axios.create({
  baseURL: `${BASE_URL}`, // Replace with your backend URL
});

// ⬆️ Automatically send JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Register Student
export const registerStudent = (data) => API.post('/students/register', data);

// ✅ Login
export const loginUser = (data) => API.post('/students/login', data);

// ✅ Get Student Profile
export const getStudentProfile = () => API.get('/students/profile');

// ✅ Update Student Profile
export const updateStudentProfile = (data) => API.put('/students/update-profile', data);
