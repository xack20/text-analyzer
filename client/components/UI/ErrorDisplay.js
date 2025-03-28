import { Alert, Button } from 'antd';

const ErrorDisplay = ({ message, retry }) => {
    return (
        <Alert
            message="Error"
            description={message || 'Something went wrong. Please try again.'}
            type="error"
            showIcon
            action={
                retry && (
                    <Button size="small" type="primary" onClick={retry}>
                        Try Again
                    </Button>
                )
            }
        />
    );
};

export default ErrorDisplay;
