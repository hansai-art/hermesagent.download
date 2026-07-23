#!/usr/bin/env node
// 開放資料:data/*.json → public/api/*.json
//
// 為什麼要公開原始數據:任何人都能稽核我們宣稱的數字,也能拿去做二創
// (統計圖表、監測工具、自己的儀表板)。透明本身就是可信度。
//
// 用法:node scripts/core/publish-api.mjs

import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../tools/lib/knowledge.mjs';

const src = join(REPO_ROOT, 'data');
const dst = join(REPO_ROOT, 'public', 'api');
mkdirSync(dst, { recursive: true });

if (!existsSync(src)) {
  console.log('⚠️  data/ 不存在,略過');
  process.exit(0);
}

const published = [];
for (const f of readdirSync(src)) {
  if (!f.endsWith('.json')) continue;
  copyFileSync(join(src, f), join(dst, f));
  published.push({ file: f, kb: Math.round(statSync(join(src, f)).size / 1024) });
}

// 索引頁,讓人知道有哪些資料可以拿
writeFileSync(
  join(dst, 'index.json'),
  JSON.stringify(
    {
      site: 'https://hermesagent.download',
      description: 'HermesAgent.download 開放資料。全部由 pipeline 自動產生,每日更新。歡迎自由取用。',
      license: 'CC BY-SA 4.0',
      source: 'https://github.com/hansai-art/hermesagent.download',
      endpoints: published.map((p) => ({
        url: `https://hermesagent.download/api/${p.file}`,
        sizeKB: p.kb,
      })),
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ) + '\n',
);

console.log(`📡 開放 API:${published.map((p) => p.file).join(', ')}`);
