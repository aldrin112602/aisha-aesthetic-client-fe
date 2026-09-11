import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { pageTitles, publicPaths, renderSeoHead, siteOrigin } from './src/seo.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const origin = siteOrigin(loadEnv(mode, process.cwd(), '').VITE_SITE_URL || '')
  const withSeo = (html: string, path: string) => html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n    ${renderSeoHead(path, origin)}\n    <!-- seo:end -->`)
  return {
    plugins: [react(), tailwindcss(), {
      name: 'aishaesthetics-seo',
      transformIndexHtml(html, context) { return withSeo(html, context.path === '/index.html' ? '/' : context.path) },
      generateBundle: { order: 'post', handler(_options, bundle) {
        const index = bundle['index.html']
        if (!index || index.type !== 'asset') return
        for (const path of Object.keys(pageTitles).filter(path => path !== '/')) {
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}/index.html`, source: withSeo(String(index.source), path) })
        }
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}` })
        if (origin) {
          this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPaths.map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>` })
        } else {
          this.warn('Set VITE_SITE_URL to the production origin to generate sitemap.xml and absolute social/canonical URLs.')
        }
      } },
    }],
  }
})
