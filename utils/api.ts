import axios from 'axios';

// IMPORTANT: Replace this with your actual IPv4 Address (NOT localhost)
const API_BASE_URL = 'http://192.168.1.15:8000'; // Make sure this is correct

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
