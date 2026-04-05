/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // images: { unoptimized: true },
  // experimental: {
  //   serverActions: true,
  // },
  images: {
    domains: [
    'i.dailymail.co.uk',
    'cdn.cnn.com',
    'media.cnn.com',
    'gnews.io',
    'cdn.gnews.io',
    'www.manilatimes.net',
  ],
  },
  

};

module.exports = nextConfig;
