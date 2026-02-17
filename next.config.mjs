/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
        workerThreads: false,
        cpus: 1,
    },
    webpack: (config) => {
        config.cache = false;
        return config;
    },
};

export default nextConfig;
