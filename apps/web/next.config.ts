import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  // Node 24 can truncate captured `tsc --showConfig` output in Next's CLI path.
  // The TypeScript compiler API is the stable path for the installed TypeScript 5.x.
  experimental: { useTypeScriptCli: false },
};
export default nextConfig;
