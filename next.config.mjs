/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "", // usually you get the hostname as an error message
      // },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "avatars.githubusercontent.com",
      //   pathname: "/**",
      // },
    ],
  },
};

export default nextConfig;
