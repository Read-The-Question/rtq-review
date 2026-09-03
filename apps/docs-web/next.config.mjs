import { createMDX } from "fumadocs-mdx/next";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const withMDX = createMDX();
const repositoriesRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  turbopack: {
    root: repositoriesRoot,
  },
};

export default withMDX(config);
