import axios from 'axios';

const api = axios.create({
    baseURL: 'https://smartseasonbnd-4fe5.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Automatically attach the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ADD THIS LINE BELOW
export default api;