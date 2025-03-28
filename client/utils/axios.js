import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (token) {
            console.log('Adding token to request');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log('No token found in localStorage');
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
