import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./drizzle/**/*'],
  },
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
