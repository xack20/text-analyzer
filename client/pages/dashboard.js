import { Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthGuard from '../components/Auth/AuthGuard';
import { useAuth } from '../contexts/AuthContext'; // Add this import
import { getUserTexts } from '../services/text';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { login } = useAuth(); // Now this will work because of the import

    useEffect(() => {
        // Extract token from URL
        const { token } = router.query;

        if (token) {
            console.log('Token received from OAuth callback');

            // Store token and update auth context
            localStorage.setItem('token', token);
            login(token);

            // Remove token from URL without page reload
            router.replace('/dashboard', undefined, { shallow: true });
        }
    }, [router.query, router, login]);

    useEffect(() => {
        const fetchTexts = async () => {
            try {
                const data = await getUserTexts();
                setTexts(data);
            } catch (error) {
                console.error('Error fetching texts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTexts();
    }, []);

    return (
        <AuthGuard>
            <div>
                {/* Rest of your component remains the same */}
            </div>
        </AuthGuard>
    );
}
