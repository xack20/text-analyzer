import { GoogleOutlined } from '@ant-design/icons';
import { Button, Card, Space, Typography } from 'antd';
import { loginWithGoogle } from '../../services/auth';

const { Title, Paragraph } = Typography;

const LoginForm = () => {
    return (
        <Card style={{ maxWidth: 500, margin: '0 auto', marginTop: 50 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>Text Analyzer</Title>
                <Paragraph>
                    Analyze your texts with powerful tools
                </Paragraph>
            </div>

            {/* <Divider>Login</Divider> */}

            <div style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<GoogleOutlined />}
                        onClick={loginWithGoogle}
                        style={{ width: '100%' }}
                    >
                        Sign in with Google
                    </Button>
                </Space>
            </div>
        </Card>
    );
};

export default LoginForm;
