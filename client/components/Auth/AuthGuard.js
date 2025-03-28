import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthGuard = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }

    return isAuthenticated ? children : null;
};

export default AuthGuard;
