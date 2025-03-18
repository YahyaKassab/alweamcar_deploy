import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback for local testing
axios.defaults.baseURL = API_URL
// axios.defaults.baseURL = 'http:/localhost:3000/api'
axios.post(`/auth/login`, {
  email: 'user@example.com',
  password: 'string'
})
.then(res => {
  const token = res.data.token;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('token', token); // Store token for persistence
  console.log('Token set successfully');
})
.catch(error => console.error('Login failed:', error));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
