import axios from '../utils/axios';

export const loginWithGoogle = () => {
    window.location.href = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
};


// In your services/auth.js
export const logout = async () => {
    try {
        // Clear token first
        localStorage.removeItem('token');

        // Call the logout endpoint
        const response = await axios.get('/auth/logout', {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('Logout response:', response.data);

        // Redirect to login page
        if (response.data && response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Still redirect to login page on error
        window.location.href = '/login';
    }
};


