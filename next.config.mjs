/** @type {import('next').NextConfig} */
const nextConfig = {
    // set basepath based on environment
    basePath: process.env.NEXT_BASEPATH ?? "",
    output: "standalone",
};

export default nextConfig;
