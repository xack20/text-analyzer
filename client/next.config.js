/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
    },
    async redirects() {
        return [
            {
                source: '/auth/google/callback',
                destination: '/api/auth/callback',
                permanent: true,
            },
        ];
    },
}

module.exports = nextConfig
