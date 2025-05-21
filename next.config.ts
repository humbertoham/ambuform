// next.config.ts
import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'

const pwaOptions = {
  dest: 'public',        // Genera sw.js y workbox-*.js en public/
  register: true,        // Auto-registra el service worker
  skipWaiting: true,     // Activa el nuevo SW inmediatamente
  // Si no usas APIs, no necesitas definir `workboxOptions.runtimeCaching`
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // …otras opciones de Next.js si las tienes
}

export default withPWA(pwaOptions)(nextConfig)
