import { BarChartOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Skeleton, Space, Typography, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteText, getTextById } from '../../services/text';
import { formatDate } from '../../utils/helpers';

const { Title, Paragraph, Text } = Typography;

const TextDetail = ({ textId }) => {
    const [text, setText] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchText = async () => {
            try {
                const data = await getTextById(textId);
                setText(data);
            } catch (error) {
                console.error('Error fetching text:', error);
                message.error('Failed to load text');
            } finally {
                setLoading(false);
            }
        };

        fetchText();
    }, [textId]);

    const handleDelete = async () => {
        try {
            await deleteText(textId);
            message.success('Text deleted successfully');
            router.push('/texts');
        } catch (error) {
            console.error('Error deleting text:', error);
            message.error('Failed to delete text');
        }
    };

    if (loading) {
        return (
            <Card>
                <Skeleton active />
            </Card>
        );
    }

    if (!text) {
        return (
            <Card>
                <Title level={4}>Text not found</Title>
                <Button type="primary" onClick={() => router.push('/texts')}>
                    Back to Texts
                </Button>
            </Card>
        );
    }

    return (
        <Card
            title={
                <Title level={3}>{text.title}</Title>
            }
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/texts/${textId}/edit`)}
                    >
                        Edit
                    </Button>
                    <Link href={`/texts/${textId}/analysis`} passHref>
                        <Button
                            type="default"
                            icon={<BarChartOutlined />}
                        >
                            Analyze
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure you want to delete this text?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            }
        >
            <Text type="secondary">
                Created: {formatDate(text.createdAt)}
                {text.updatedAt !== text.createdAt &&
                    ` | Updated: ${formatDate(text.updatedAt)}`
                }
            </Text>

            <Paragraph
                style={{
                    marginTop: 16,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6'
                }}
            >
                {text.content}
            </Paragraph>
        </Card>
    );
};

export default TextDetail;
