import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['scontent.fhan15-1.fna.fbcdn.net', 'lh3.google.com', 'lh3.googleusercontent.com', 'img.vietqr.io'], // Add the domain here
  },
};

export default nextConfig;
