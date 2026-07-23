#!/usr/bin/env node
// 貢獻者資料:GitHub API → data/contributors.json
//
// 「展現貢獻者」是共筆專案最基本的回饋機制——有人願意花時間寫,
// 至少要讓他的名字被看見。這份資料同時供貢獻者牆與儀表板使用。
//
// 用法:node scripts/core/generate-contributors.mjs
//   有 GITHUB_TOKEN 時額度較高(5000/hr),沒有也能跑(60/hr,足夠每日一次)

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../tools/lib/knowledge.mjs';

const REPO = process.env.GITHUB_REPOSITORY || 'hansai-art/hermesagent.download';
const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'hermesagent-download-contributors',
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${path}: HTTP ${res.status}`);
  return res.json();
}

// 1. 貢獻者(依 commit 數)
const raw = await gh(`repos/${REPO}/contributors?per_page=100`);
const contributors = raw
  .filter((c) => c.type === 'User' && !/\[bot\]$/.test(c.login))
  .map((c) => ({
    login: c.login,
    avatar: c.avatar_url,
    url: c.html_url,
    contributions: c.contributions,
  }));

// 2. 近期活動(讓儀表板看得出「這個站是活的」)
let recentCommits = 0;
let lastCommitAt = null;
try {
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const commits = await gh(`repos/${REPO}/commits?since=${since}&per_page=100`);
  recentCommits = commits.length;
  lastCommitAt = commits[0]?.commit?.author?.date ?? null;
} catch (e) {
  console.error(`⚠️  近期 commit 抓取失敗(非致命):${e.message}`);
}

// 3. repo 概況
let repoInfo = {};
try {
  const r = await gh(`repos/${REPO}`);
  repoInfo = { stars: r.stargazers_count, forks: r.forks_count, openIssues: r.open_issues_count };
} catch (e) {
  console.error(`⚠️  repo 資訊抓取失敗(非致命):${e.message}`);
}

const out = {
  generatedAt: new Date().toISOString(),
  repo: REPO,
  total: contributors.length,
  contributors,
  activity: { recentCommits30d: recentCommits, lastCommitAt },
  ...repoInfo,
};

mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
writeFileSync(join(REPO_ROOT, 'data', 'contributors.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`👥 ${contributors.length} 位貢獻者.近 30 天 ${recentCommits} 次 commit`);
