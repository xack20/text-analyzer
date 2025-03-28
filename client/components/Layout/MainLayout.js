import { Layout } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { isAuthenticated } = useAuth();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {isAuthenticated && (
                <Sidebar collapsed={collapsed} />
            )}
            <Layout>
                <Navbar
                    collapsed={collapsed}
                    toggleSidebar={toggleSidebar}
                    showToggle={isAuthenticated}
                />
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
