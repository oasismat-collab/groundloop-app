/**
 * Next.js config.
 *
 * For GitHub Pages we produce a fully static export (`output: 'export'`) into
 * `out/`. Pages serves a *project* site under a sub-path
 * (https://<owner>.github.io/<repo>/), so we set basePath / assetPrefix to that
 * repo name when building for Pages.
 *
 * Local dev and `npm run build` (no PAGES env) keep basePath empty so the site
 * runs at `/` as before. The GitHub Actions workflow sets NEXT_PUBLIC_BASE_PATH
 * to `/groundloop-app` for the Pages build.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — no Node server needed, so GitHub Pages can host it.
  output: 'export',
  // Emit each route as a folder with index.html (e.g. /map/index.html) so
  // Pages serves it at /map/ without server-side rewrites.
  trailingSlash: true,
  // Pages has no Next image optimizer.
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  // Surface the prefix to the client so raw <a>/<iframe> paths (which Next does
  // NOT auto-prefix, unlike next/link) can build correct URLs.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
