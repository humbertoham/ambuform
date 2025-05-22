import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Cache de los archivos estáticos de Next (_next)
      urlPattern: /^\/_next\/static\/.*/i,
      handler: StaleWhileRevalidate,
      options: {
        cacheName: 'static-resources',
      },
    },
    {
      // Cache de tu CSS/JS/build output
      urlPattern: /^\/_next\/image\/.*/i,
      handler: CacheFirst,
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      // Cache de las rutas de tu app (páginas)
      urlPattern: /^\/.*$/i,
      handler: NetworkFirst,
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
      },
    },
  ],
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // si quieres deshabilitar en dev:
  // pwa: { disable: process.env.NODE_ENV === 'development' }
}

export default withPWA(pwaOptions)(nextConfig)