import { ConfigProvider } from 'antd';
import Head from 'next/head';
import { useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Fix for Ant Design styling issues in development mode
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Text Analyzer</title>
                <meta name="description" content="Analyze your texts with powerful tools" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <ConfigProvider>
                <AuthProvider>
                    <MainLayout>
                        <Component {...pageProps} />
                    </MainLayout>
                </AuthProvider>
            </ConfigProvider>
        </>
    );
}

export default MyApp;
