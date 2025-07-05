import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    output: 'standalone',
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/api/:path*`,
            },
        ];
    },
    webpackDevMiddleware: (config: any) => {
        config.watchOptions = {
            poll: 100,
            aggregateTimeout: 300,
        };
        return config;
    },
};

export default nextConfig;
