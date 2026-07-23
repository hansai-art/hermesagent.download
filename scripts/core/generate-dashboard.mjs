#!/usr/bin/env node
// 儀表板資料:knowledge/ + pipeline 產物 → data/dashboard.json
//
// 設計意圖:公開這個站的「生命徵象」。不只是好看的數字,而是要回答三個問題:
//   1. 這個站是活的嗎?(近期活動、上游同步狀態)
//   2. 這裡的內容可信嗎?(引用覆蓋率、驗證新鮮度、健康掃描結果)
//   3. 我能幫上什麼忙?(內容缺口 — 這是最重要的一欄)
//
// 用法:node scripts/core/generate-dashboard.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, VERIFIED_CATEGORIES, daysSince, loadArticles } from '../tools/lib/knowledge.mjs';
import { CATEGORIES } from '../../src/config/categories.mjs';

const FRESH_DAYS = 90;
const articles = loadArticles();
const live = articles.filter((a) => {
  const s = a.data.status ?? 'published';
  return s !== 'draft' && s !== 'archived';
});

// ── 內容:分類分布與缺口 ──
const byCategory = CATEGORIES.map((c) => {
  const items = live.filter((a) => a.category === c.slug);
  return {
    slug: c.slug,
    emoji: c.emoji,
    name: c.name,
    count: items.length,
    // 缺口判定:文章數偏少的分類就是最需要人手的地方
    needsHelp: items.length < 3,
  };
});

// ── 可信度:引用與驗證 ──
let withRefs = 0;
let footnotes = 0;
let verifiedFresh = 0;
let verifiedStale = 0;
let neverVerified = 0;

for (const a of live) {
  const refs = (a.data.upstream_refs?.length ?? 0) + (a.data.sources?.length ?? 0);
  if (refs > 0) withRefs++;
  footnotes += (a.content.match(/^\[\^[^\]]+\]:/gm) ?? []).length;

  if (VERIFIED_CATEGORIES.includes(a.category)) {
    if (!a.data.last_verified) neverVerified++;
    else if (daysSince(a.data.last_verified) > FRESH_DAYS) verifiedStale++;
    else verifiedFresh++;
  }
}

// ── 活躍度:接上 contributors pipeline 的產物 ──
let contributors = null;
const cPath = join(REPO_ROOT, 'data', 'contributors.json');
if (existsSync(cPath)) {
  const c = JSON.parse(readFileSync(cPath, 'utf-8'));
  contributors = {
    total: c.total,
    stars: c.stars ?? 0,
    forks: c.forks ?? 0,
    recentCommits30d: c.activity?.recentCommits30d ?? 0,
    lastCommitAt: c.activity?.lastCommitAt ?? null,
    top: (c.contributors ?? []).slice(0, 12),
  };
}

// ── 上游同步狀態 ──
let upstream = null;
const uPath = join(REPO_ROOT, 'data', 'upstream-state.json');
if (existsSync(uPath)) {
  const u = JSON.parse(readFileSync(uPath, 'utf-8'));
  upstream = {
    lastReleaseTag: u.lastReleaseTag ?? null,
    checkedAt: u.checkedAt ?? null,
    daysSinceCheck: u.checkedAt ? daysSince(u.checkedAt) : null,
  };
}

const dashboard = {
  generatedAt: new Date().toISOString(),
  content: {
    total: live.length,
    byStatus: articles.reduce((acc, a) => {
      const s = a.data.status ?? 'published';
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {}),
    byCategory,
    gaps: byCategory.filter((c) => c.needsHelp).map((c) => c.slug),
  },
  credibility: {
    withSources: withRefs,
    withSourcesPct: Math.round((withRefs / live.length) * 100),
    footnotes,
    verifiedFresh,
    verifiedStale,
    neverVerified,
    freshnessThresholdDays: FRESH_DAYS,
  },
  activity: contributors,
  upstream,
};

mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
writeFileSync(join(REPO_ROOT, 'data', 'dashboard.json'), JSON.stringify(dashboard, null, 2) + '\n');

console.log(`📊 儀表板:${live.length} 篇.來源覆蓋 ${dashboard.credibility.withSourcesPct}%.${footnotes} 個腳註`);
console.log(`   驗證新鮮 ${verifiedFresh} / 過期 ${verifiedStale} / 未驗證 ${neverVerified}`);
console.log(`   待補分類:${dashboard.content.gaps.join(', ') || '(無)'}`);
