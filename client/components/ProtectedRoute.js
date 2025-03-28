// components/ProtectedRoute.js
import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    // If not authenticated and not loading, don't render children
    if (!user && !loading) {
        return null;
    }

    // If authenticated, render children
    return children;
};

export default ProtectedRoute;
