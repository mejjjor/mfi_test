module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**openweathermap.org",
      },
    ],
  },
};
