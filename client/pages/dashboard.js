import { BarChartOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Statistic, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthGuard from '../components/Auth/AuthGuard';
import { getUserTexts } from '../services/text';
import { formatDate } from '../utils/helpers';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [jwtToken , setJwtToken] = useState(null);

    useEffect(() => {
        // Check for token in URL (from OAuth callback)
        const { token } = router.query;
        if (token) {
            if (!localStorage.getItem('token')) {
                localStorage.setItem('token', token);
                router.push('/dashboard?token=' + token);
            }
            setJwtToken(token);
            // Remove token from URL without page reload
            router.replace('/dashboard', undefined, { shallow: true });
        } else if (localStorage.getItem('token')) {
            setJwtToken(localStorage.getItem('token'));
        }
    }, [router]);

    useEffect(() => {
        if (jwtToken) {
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
        }
    }, [jwtToken]);

    return (
        <AuthGuard>
            <div>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <Title level={2}>Dashboard</Title>
                        <Paragraph>Welcome to your Text Analyzer dashboard</Paragraph>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Total Texts"
                                value={texts.length}
                                prefix={<FileTextOutlined />}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Latest Update"
                                value={texts.length > 0 ? formatDate(texts[0]?.updatedAt) : 'N/A'}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Link href="/texts/new" passHref>
                                    <Button type="primary" icon={<PlusOutlined />} size="large">
                                        Create New Text
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col span={24}>
                        <Card title="Recent Texts" loading={loading}>
                            <List
                                dataSource={texts.slice(0, 5)}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <Link href={`/texts/${item._id}`} key="edit">
                                                <Button type="link" size="small">Edit</Button>
                                            </Link>,
                                            <Link href={`/texts/${item._id}/analysis`} key="analyze">
                                                <Button type="link" size="small" icon={<BarChartOutlined />}>Analyze</Button>
                                            </Link>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={<Link href={`/texts/${item._id}`}>{item.title}</Link>}
                                            description={`Updated: ${formatDate(item.updatedAt)}`}
                                        />
                                        <div>{item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}</div>
                                    </List.Item>
                                )}
                                locale={{ emptyText: 'No texts found. Create your first text!' }}
                            />
                            {texts.length > 5 && (
                                <div style={{ textAlign: 'center', marginTop: 16 }}>
                                    <Link href="/texts" passHref>
                                        <Button type="default">View All Texts</Button>
                                    </Link>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </AuthGuard>
    );
}
