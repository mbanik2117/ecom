/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**", // Adjust if needed based on your storage bucket structure
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/_next/image(.*)", // Cache optimized images
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // Cache images for 1 year
          },
        ],
      },
    ];
  },
};

export default nextConfig;
