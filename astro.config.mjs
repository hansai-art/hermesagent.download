// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeExternalLinks from 'rehype-external-links';

// 舊站(Phase 1 搬遷前)URL → 新分類 URL。
// issue 頁(/issues/NNNNN/)與 /install/wsl2/ 等 slug 相同者不需轉址。
const schoolRedirects = Object.fromEntries(
  [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 27, 28, 29, 30, 31, 32].map(
    (n) => {
      const s = `school-${String(n).padStart(2, '0')}`;
      return [`/school/${s}`, `/guides/${s}/`];
    },
  ),
);
const troubleshootRedirects = Object.fromEntries(
  ['api-key-not-set', 'command-not-found', 'context-length-exceeded', 'python-version-too-old', 'telegram'].map(
    (s) => [`/troubleshooting/${s}`, `/troubleshoot/${s}/`],
  ),
);

export default defineConfig({
  site: 'https://hermesagent.download',
  redirects: {
    '/download': '/install/download/',
    '/download/macos': '/install/macos/',
    '/download/windows': '/install/windows/',
    '/download/linux': '/install/linux/',
    '/start': '/guides/start/',
    '/start/model-provider': '/config/model-provider/',
    '/start/migrate-from-openclaw': '/migrate/migrate-from-openclaw/',
    '/school': '/guides/',
    '/troubleshooting': '/troubleshoot/overview/',
    '/skills-mcp': '/skills/skills-mcp-overview/',
    '/mcp': '/integrations/recommended-mcp/',
    '/resources': '/community/resources/',
    ...schoolRedirects,
    ...troubleshootRedirects,
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // 個別 issue 鏡像頁為 noindex,不放進 sitemap(sitemap 只該列可索引頁)。
      // 保留 /issues/ 分類索引頁本身。
      filter: (page) => !/\/issues\/[^/]+\/?$/.test(page),
    }),
  ],
  markdown: {
    // 2026-07-30：smartypants 把正文裡的 `--flag` 轉成破折號，21 個 CLI 參數
    // 在 16 頁上被印錯（`--tui` 變 `—tui`、`--no-skills` 變 `—no-skills`、
    // `--output-format` 變 `—output-format`…）。讀者照抄會失敗，而且使用者真正
    // 會搜的那串字根本不在頁面上。
    // 這是 CLI 文件站，`--` 的正確性遠比彎引號與省略號好看重要。
    smartypants: false,
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
      langs: [
        'bash',
        'sh',
        'powershell',
        'python',
        'ts',
        'js',
        'json',
        'yaml',
        'toml',
        'md',
        'html',
        'css',
        'diff',
        'docker',
        'plaintext',
      ],
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: '_blank', rel: ['noopener', 'noreferrer'] },
      ],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
