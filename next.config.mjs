/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/home",
        permanent: true, // or false
      },
    ];
  },
};

export default nextConfig;
