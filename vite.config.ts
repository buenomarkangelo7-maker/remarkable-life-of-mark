import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const rawBase = process.env.VITE_BASE_PATH || '/';
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  return {
    base: normalizedBase,
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ and prepares SPA routing for GitHub Pages / static hosts.
      {
        name: 'copy-unbundled-src-assets-and-gh-pages',
        apply: 'build',
        transformIndexHtml(html: string) {
          return html
            .replaceAll('href="/favicon.svg"', `href="${normalizedBase}favicon.svg"`)
            .replaceAll(
              'content="/src/assets/images/hero_mark_portrait_1794835743482.jpg"',
              `content="${normalizedBase}src/assets/images/hero_mark_portrait_1794835743482.jpg"`
            );
        },
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
          if (fs.existsSync(distDir)) {
            fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
            const safeBase = JSON.stringify(normalizedBase);
            const spa404Html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting…</title>
    <script>
      (function () {
        var base = ${safeBase};
        var l = window.location;
        var pathname = l.pathname;
        if (base !== '/' && pathname.indexOf(base) === 0) {
          pathname = '/' + pathname.slice(base.length);
        }
        var target = pathname + l.search;
        var dest = l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + base + '?p=' + encodeURIComponent(target) + l.hash;
        l.replace(dest);
      })();
    </script>
  </head>
  <body></body>
</html>
`;
            fs.writeFileSync(path.join(distDir, '404.html'), spa404Html, 'utf8');
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
