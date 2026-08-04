import path from "path"

const root = path.resolve(process.cwd(), "..")
const localModules = path.resolve(process.cwd(), "node_modules")

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: root,
  webpack: (config) => {
    // The block lives in ../apps/v4; make its bare imports (clsx, lucide-react,
    // radix-ui, …) resolve from this app's node_modules.
    config.resolve.modules = [localModules, ...(config.resolve.modules || ["node_modules"])]
    return config
  },
}

export default nextConfig
