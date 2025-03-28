import { message } from 'antd';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/api';
import { getUserFromToken, isAuthenticated } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            if (isAuthenticated()) {
                try {
                    const userData = await fetchCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const userData = getUserFromToken(token);
        setUser(userData);
        router.push('/dashboard');
        message.success('Login successful!');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
        message.info('You have been logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
