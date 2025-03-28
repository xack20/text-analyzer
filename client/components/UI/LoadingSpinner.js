import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const LoadingSpinner = ({ tip = 'Loading...' }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '40px'
        }}>
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                tip={tip}
            />
        </div>
    );
};

export default LoadingSpinner;
