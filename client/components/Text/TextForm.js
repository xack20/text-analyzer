import { Button, Card, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createText, getTextById, updateText } from '../../services/text';

const { TextArea } = Input;

const TextForm = ({ textId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(!!textId);
    const router = useRouter();

    useEffect(() => {
        const fetchText = async () => {
            try {
                if (textId) {
                    const data = await getTextById(textId);
                    form.setFieldsValue({
                        title: data.title,
                        content: data.content
                    });
                }
            } catch (error) {
                console.error('Error fetching text:', error);
                message.error('Failed to load text');
            } finally {
                setInitializing(false);
            }
        };

        if (textId) {
            fetchText();
        }
    }, [textId, form]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            if (textId) {
                await updateText(textId, values);
                message.success('Text updated successfully');
            } else {
                await createText(values);
                message.success('Text created successfully');
            }
            router.push('/texts');
        } catch (error) {
            console.error('Error saving text:', error);
            message.error('Failed to save text');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={textId ? "Edit Text" : "Create New Text"}
            loading={initializing}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ title: '', content: '' }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="Enter title" />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Content"
                    rules={[{ required: true, message: 'Please enter content' }]}
                >
                    <TextArea
                        placeholder="Enter your text here..."
                        rows={15}
                        showCount
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {textId ? 'Update' : 'Create'}
                    </Button>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => router.push('/texts')}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default TextForm;
