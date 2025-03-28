import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp > currentTime;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};

export const getUserFromToken = () => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
