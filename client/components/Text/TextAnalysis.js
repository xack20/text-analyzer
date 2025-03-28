import { EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, List, Row, Skeleton, Statistic, Tag, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getTextAnalysis, getTextById } from '../../services/text';

const { Title, Paragraph, Text } = Typography;

const TextAnalysis = ({ textId }) => {
    const [text, setText] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [textData, analysisData] = await Promise.all([
                    getTextById(textId),
                    getTextAnalysis(textId)
                ]);

                setText(textData);
                setAnalysis(analysisData);
            } catch (error) {
                console.error('Error fetching analysis:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [textId]);

    if (loading) {
        return (
            <Card>
                <Skeleton active />
            </Card>
        );
    }

    if (!text || !analysis) {
        return (
            <Card>
                <Title level={4}>Could not load analysis</Title>
                <Button type="primary" onClick={() => router.push('/texts')}>
                    Back to Texts
                </Button>
            </Card>
        );
    }

    return (
        <div>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Title level={3}>Analysis: {text.title}</Title>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => router.push(`/texts/${textId}`)}
                        >
                            Back to Text
                        </Button>
                    </div>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Words"
                            value={analysis.wordCount}
                            prefix={<FileTextOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Characters"
                            value={analysis.characterCount}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Sentences"
                            value={analysis.sentenceCount}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Paragraphs"
                            value={analysis.paragraphCount}
                        />
                    </Col>
                </Row>

                <Divider>Longest Words by Paragraph</Divider>

                <List
                    bordered
                    dataSource={analysis.longestWords}
                    renderItem={(word, index) => (
                        <List.Item>
                            <Text strong>Paragraph {index + 1}:</Text> <Tag color="blue">{word}</Tag>
                        </List.Item>
                    )}
                />

                <Divider>Text Preview</Divider>

                <Paragraph
                    ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {text.content}
                </Paragraph>
            </Card>
        </div>
    );
};

export default TextAnalysis;
