import type { NextConfig } from 'next';

/**
 * `/socket.io` -> the game server.
 *
 * The app talks to the Socket.IO server through this rewrite so the browser only
 * ever sees one origin. That keeps cookies, CORS and the in-app preview happy, and
 * means `NEXT_PUBLIC_SERVER_URL` can stay unset in production.
 */
const SERVER = process.env.SERVER_URL ?? 'http://127.0.0.1:4000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Socket.IO asks for `/socket/?EIO=4…` (with the slash). Next would normally
   * redirect that to `/socket`, which is a different route on the game server, so
   * the handshake 404s. Turning the redirect off lets the rewrite below forward it
   * exactly as sent.
   */
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/webp'],
  },
  async rewrites() {
    return [
      { source: '/socket.io/:path*', destination: `${SERVER}/socket.io/:path*` },
      { source: '/socket.io', destination: `${SERVER}/socket.io/` },
    ];
  },
};

export default nextConfig;
