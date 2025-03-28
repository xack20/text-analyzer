import {
    DashboardOutlined,
    FileTextOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const router = useRouter();
  
  const getSelectedKeys = () => {
    const path = router.pathname;
    if (path === '/dashboard') return ['dashboard'];
    if (path === '/texts') return ['texts'];
    if (path === '/texts/new') return ['new-text'];
    if (path.includes('/texts/') && path.includes('/analysis')) return ['analysis'];
    if (path.includes('/texts/')) return ['texts'];
    return [];
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
      <div style={{ 
        height: 64, 
        margin: 16, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
        fontSize: collapsed ? '14px' : '20px',
        fontWeight: 'bold'
      }}>
        {collapsed ? 'TA' : 'Text Analyzer'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link href="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="texts" icon={<FileTextOutlined />}>
          <Link href="/texts">My Texts</Link>
        </Menu.Item>
        <Menu.Item key="new-text" icon={<PlusOutlined />}>
          <Link href="/texts/new">New Text</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
