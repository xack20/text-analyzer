import { BarChartOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table, Typography, message } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { deleteText, getUserTexts } from '../../services/text';
import { formatDate } from '../../utils/helpers';

const { Title } = Typography;

const TextList = () => {
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchTexts();
    }, []);

    const fetchTexts = async () => {
        try {
            setLoading(true);
            const data = await getUserTexts();
            setTexts(data);
        } catch (error) {
            console.error('Error fetching texts:', error);
            message.error('Failed to load texts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteText(id);
            message.success('Text deleted successfully');
            fetchTexts();
        } catch (error) {
            console.error('Error deleting text:', error);
            message.error('Failed to delete text');
        }
    };

    const filteredTexts = texts.filter(text =>
        text.title.toLowerCase().includes(searchText.toLowerCase()) ||
        text.content.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Link href={`/texts/${record._id}`}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Content Preview',
            dataIndex: 'content',
            key: 'content',
            render: text => text.length > 100 ? `${text.substring(0, 100)}...` : text,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: text => formatDate(text),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/texts/${record._id}`} passHref>
                        <Button type="primary" icon={<EditOutlined />} size="small">
                            Edit
                        </Button>
                    </Link>
                    <Link href={`/texts/${record._id}/analysis`} passHref>
                        <Button type="default" icon={<BarChartOutlined />} size="small">
                            Analyze
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure you want to delete this text?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3}>My Texts</Title>
                <Space>
                    <Input
                        placeholder="Search texts"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Link href="/texts/new" passHref>
                        <Button type="primary">Create New Text</Button>
                    </Link>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={filteredTexts}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default TextList;
