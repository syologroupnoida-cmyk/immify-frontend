/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [{ source: "/services/:slug", destination: "/providers", permanent: true }];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: false,
  reactStrictMode: true,
};

export default nextConfig;
