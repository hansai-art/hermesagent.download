#!/usr/bin/env node
// STATS pipeline:每日統計 → data/stats.json + README 統計區塊(marker 之間)。
//
// README 的數字是自動注入的(SSOT 是 knowledge/ 與 data/*.json),不要手改。
//
// 用法:node scripts/tools/generate-stats.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, daysSince, loadArticles } from './lib/knowledge.mjs';

const articles = loadArticles();

const byCategory = {};
const byStatus = {};
for (const a of articles) {
  byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
  const s = a.data.status ?? 'published';
  byStatus[s] = (byStatus[s] ?? 0) + 1;
}

// 近期更新篇數(用 date 欄位近似,不打 git)
const recent = (days) =>
  articles.filter((a) => a.data.date && daysSince(a.data.date) <= days).length;

const readJson = (name) => {
  const p = join(REPO_ROOT, 'data', name);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf-8')) : null;
};
const contributors = readJson('contributors.json');
const dashboard = readJson('dashboard.json');

const stats = {
  generatedAt: new Date().toISOString(),
  total: articles.length,
  published: byStatus.published ?? 0,
  byStatus,
  byCategory: Object.fromEntries(Object.entries(byCategory).sort((x, y) => y[1] - x[1])),
  articlesLast7Days: recent(7),
  articlesLast30Days: recent(30),
  contributors: contributors?.total ?? null,
  stars: contributors?.stars ?? null,
  forks: contributors?.forks ?? null,
  commitsLast30Days: contributors?.activity?.recentCommits30d ?? null,
  sourceCoveragePct: dashboard?.credibility?.withSourcesPct ?? null,
  verifiedFresh: dashboard?.credibility?.verifiedFresh ?? null,
};

mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
writeFileSync(join(REPO_ROOT, 'data', 'stats.json'), JSON.stringify(stats, null, 2) + '\n');

// ── README 統計表(marker 之間自動改寫)──
const rows = [
  ['📄 文章總數', stats.total],
  ['✅ 已發布', stats.published],
  ['🔗 有官方來源', stats.sourceCoveragePct != null ? `${stats.sourceCoveragePct}%` : '—'],
  ['🔍 近期實測驗證', stats.verifiedFresh ?? '—'],
  ['👥 貢獻者', stats.contributors ?? '—'],
  ['⭐ GitHub Stars', stats.stars ?? '—'],
  ['🔨 近 30 天更新', stats.commitsLast30Days ?? '—'],
];

const block = [
  '<!-- STATS:START — 由 scripts/tools/generate-stats.mjs 自動產生(SSOT: knowledge/ + data/*.json)。請勿手動編輯。 -->',
  '',
  '| 指標 | 數字 |',
  '|---|---|',
  ...rows.map(([k, v]) => `| ${k} | ${v} |`),
  '',
  `<sub>每日自動更新.最後更新 ${stats.generatedAt.slice(0, 10)}.原始資料:[/api/stats.json](https://hermesagent.download/api/stats.json)</sub>`,
  '',
  '<!-- STATS:END -->',
].join('\n');

const readmePath = join(REPO_ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf-8');
if (readme.includes('STATS:START')) {
  writeFileSync(readmePath, readme.replace(/<!-- STATS:START[\s\S]*?<!-- STATS:END -->/, block));
} else {
  console.log('⚠️  README 沒有 STATS marker,只寫 data/stats.json');
}

console.log(`📊 ${stats.total} 篇`, stats.byStatus);
