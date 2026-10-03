import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

const repositoriesRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../..',
);

const nextConfig: NextConfig = {
  turbopack: {
    root: repositoriesRoot,
  },
};

export default nextConfig;
