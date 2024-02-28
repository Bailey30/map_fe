/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 3600,
        remotePatterns: [{
            protocol: "https",
            hostname: "guinnessimagebucket.s3.eu-west-2.amazonaws.com"
        } ]
    }
};

export default nextConfig;
