import axios from 'axios';
import BASE_URL from '../apiConfig';

const API = axios.create({
  baseURL: `${BASE_URL}`, 
});

//  Automatically send JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


// Register Student
export const registerStudent = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}/students/register`, payload);
    return res.data;
  } catch (err) {
    console.error("Registration error:", err.response?.data || err.message);
    throw err;
  }
};


export const getMyApplications = async (userId) => {
  const res = await axios.get(`${BASE_URL}/job/my-applications/${userId}`);
  return res.data;
};

// Login
export const loginUser = (data) => API.post('/students/login', data);

// Get Student Profile
export const getStudentProfile = () => API.get('/students/profile');

// Update Student Profile
export const updateStudentProfile = (data) => API.put('/students/update-profile', data);
