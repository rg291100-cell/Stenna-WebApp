import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // ✅ Vercel-safe, prod + local
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
