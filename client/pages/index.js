import { BarChartOutlined, FileTextOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loginWithGoogle } from '../services/auth';

const { Title, Paragraph } = Typography;

export default function Home() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <Title>Text Analyzer</Title>
                <Paragraph style={{ fontSize: 18 }}>
                    A powerful tool to analyze and understand your texts
                </Paragraph>
                {!isAuthenticated && (
                    <Button
                        type="primary"
                        size="large"
                        icon={<LoginOutlined />}
                        onClick={loginWithGoogle}
                    >
                        Sign in with Google
                    </Button>
                )}
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card
                        title="Text Management"
                        bordered={false}
                        style={{ height: '100%' }}
                        cover={<div style={{
                            height: 160,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#f5f5f5'
                        }}>
                            <FileTextOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                        </div>}
                    >
                        <Paragraph>
                            Create, edit, and organize your texts in one place. Our platform provides a clean interface for managing all your text documents.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        title="Detailed Analysis"
                        bordered={false}
                        style={{ height: '100%' }}
                        cover={<div style={{
                            height: 160,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#f5f5f5'
                        }}>
                            <BarChartOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                        </div>}
                    >
                        <Paragraph>
                            Get comprehensive analysis of your texts including word count, character count, sentence count, paragraph count, and longest words.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card
                        title="Secure & Fast"
                        bordered={false}
                        style={{ height: '100%' }}
                        cover={<div style={{
                            height: 160,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#f5f5f5'
                        }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="#1890ff">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                            </svg>
                        </div>}
                    >
                        <Paragraph>
                            Your texts are secure with OAuth authentication. Our application is optimized for performance with caching and rate limiting.
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
