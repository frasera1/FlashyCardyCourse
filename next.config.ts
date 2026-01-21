import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure middleware is properly traced for Vercel deployment
  outputFileTracingIncludes: {
    '/': ['./middleware.ts'],
  },
}

export default nextConfig
