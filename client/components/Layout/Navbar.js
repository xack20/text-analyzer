import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/auth';

const { Header } = Layout;

const Navbar = ({ collapsed, toggleSidebar, showToggle }) => {
    const { user } = useAuth();

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div>
                {showToggle && (
                    <Button
                        type="text"
                        onClick={toggleSidebar}
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                )}
            </div>

            <div style={{ marginRight: 20 }}>
                {user && (
                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <a onClick={e => e.preventDefault()}>
                            <Space>
                                <Avatar icon={<UserOutlined />} />
                                <span>{user.displayName || user.name}</span>
                            </Space>
                        </a>
                    </Dropdown>
                )}
            </div>
        </Header>
    );
};

export default Navbar;
