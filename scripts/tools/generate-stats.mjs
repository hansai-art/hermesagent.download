#!/usr/bin/env node
// STATS pipeline:每日統計 → data/stats.json + README 統計區塊(marker 之間)。
//
// 用法:node scripts/tools/generate-stats.mjs

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, loadArticles } from './lib/knowledge.mjs';

const articles = loadArticles();

const byCategory = {};
const byStatus = {};
for (const a of articles) {
  byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
  const s = a.data.status ?? 'published';
  byStatus[s] = (byStatus[s] ?? 0) + 1;
}

const stats = {
  generatedAt: new Date().toISOString(),
  total: articles.length,
  byStatus,
  byCategory: Object.fromEntries(Object.entries(byCategory).sort((x, y) => y[1] - x[1])),
};

mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
writeFileSync(join(REPO_ROOT, 'data', 'stats.json'), JSON.stringify(stats, null, 2) + '\n');

// README 統計區塊(<!-- STATS:START --> … <!-- STATS:END --> 之間自動改寫)
const readmePath = join(REPO_ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf-8');
const block = [
  '<!-- STATS:START -->',
  '',
  `**${stats.total}** 篇文章.published ${byStatus.published ?? 0}.draft ${byStatus.draft ?? 0}.outdated ${byStatus.outdated ?? 0}.archived ${byStatus.archived ?? 0}(${stats.generatedAt.slice(0, 10)} 更新)`,
  '',
  '<!-- STATS:END -->',
].join('\n');
const updated = readme.replace(/<!-- STATS:START -->[\s\S]*?<!-- STATS:END -->/, block);

if (updated === readme && !readme.includes('STATS:START')) {
  console.log('⚠️  README 沒有 STATS marker,只寫 data/stats.json');
} else {
  writeFileSync(readmePath, updated);
}
console.log(`📊 ${stats.total} 篇`, stats.byStatus);
