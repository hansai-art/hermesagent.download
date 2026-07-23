#!/usr/bin/env node
// UPSTREAM-WATCH pipeline:監看上游 release,自動開 issue 引導社群更新文章。
// 「自動進化」機制的眼睛——網站因此知道自己哪裡可能舊了。
//
// 流程:
//   1. 抓 NousResearch/hermes-agent 最新 releases
//   2. 與 data/upstream-state.json 比對,找出新 release
//   3. 有新 release → 開 issue(label: upstream-release),列出可能受影響的文章
//   4. 更新 state 檔(workflow 會 commit)
//
// 用法:
//   node scripts/tools/upstream-watch.mjs            # CI(需 GITHUB_TOKEN + GITHUB_REPOSITORY)
//   node scripts/tools/upstream-watch.mjs --dry-run  # 本地測試,只印不開 issue

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, VERIFIED_CATEGORIES, loadArticles } from './lib/knowledge.mjs';

const UPSTREAM = 'NousResearch/hermes-agent';
const STATE_FILE = join(REPO_ROOT, 'data', 'upstream-state.json');
const DRY_RUN = process.argv.includes('--dry-run') || !process.env.GITHUB_REPOSITORY;

const ghHeaders = {
  accept: 'application/vnd.github+json',
  'user-agent': 'hermesagent-download-upstream-watch',
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

// ── 1. 抓上游 releases ──
const res = await fetch(`https://api.github.com/repos/${UPSTREAM}/releases?per_page=10`, {
  headers: ghHeaders,
});
if (!res.ok) {
  console.error(`❌ 抓 ${UPSTREAM} releases 失敗:HTTP ${res.status}`);
  process.exit(1);
}
const releases = (await res.json()).filter((r) => !r.draft);
if (releases.length === 0) {
  console.log('上游沒有 release,結束。');
  process.exit(0);
}

// ── 2. 與 state 比對 ──
const state = existsSync(STATE_FILE)
  ? JSON.parse(readFileSync(STATE_FILE, 'utf-8'))
  : { lastReleaseId: 0 };
const fresh = releases.filter((r) => r.id > state.lastReleaseId);

if (fresh.length === 0) {
  console.log(`✅ 沒有新 release(最新仍是 ${releases[0].tag_name})`);
  process.exit(0);
}
console.log(`📰 發現 ${fresh.length} 個新 release:${fresh.map((r) => r.tag_name).join(', ')}`);

// ── 3. 找可能受影響的文章 ──
const articles = loadArticles().filter((a) => (a.data.status ?? 'published') === 'published');
const affected = articles.filter(
  (a) => VERIFIED_CATEGORIES.includes(a.category) || a.data.hermes_version !== '*',
);

function issueBody(release) {
  const lines = [
    `上游發布了 **[${release.tag_name}](${release.html_url})**(${release.published_at?.slice(0, 10) ?? ''})。`,
    '',
    '## Release Notes 摘要',
    '',
    '```',
    (release.body ?? '(無說明)').slice(0, 3000),
    '```',
    '',
    `## 可能需要重新驗證的文章(${affected.length} 篇)`,
    '',
    '教學/操作類文章請對照 release notes 檢查;確認仍正確就更新 `last_verified`,',
    '已失效就修文或標 `status: outdated`。認領方式:在下方留言 + 開 PR。',
    '',
  ];
  for (const a of affected.slice(0, 40)) {
    lines.push(
      `- [ ] \`knowledge/${a.rel}\`(${a.data.title};hermes_version: ${a.data.hermes_version ?? '*'};最後驗證 ${a.data.last_verified ? String(a.data.last_verified).slice(0, 10) : '—'})`,
    );
  }
  if (affected.length > 40) lines.push(`- …以及其他 ${affected.length - 40} 篇(見 knowledge/)`);
  lines.push('', '---', '*此 issue 由 UPSTREAM-WATCH pipeline 自動建立。*');
  return lines.join('\n');
}

for (const release of fresh.reverse()) {
  const title = `📰 上游新版本 ${release.tag_name}:文章驗證清單`;
  if (DRY_RUN) {
    console.log(`\n[dry-run] 將開 issue:「${title}」`);
    console.log(issueBody(release).slice(0, 1500));
    continue;
  }
  const r = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues`, {
    method: 'POST',
    headers: ghHeaders,
    body: JSON.stringify({ title, body: issueBody(release), labels: ['upstream-release'] }),
  });
  if (!r.ok) {
    console.error(`❌ 開 issue 失敗:HTTP ${r.status} ${await r.text()}`);
    process.exit(1);
  }
  console.log(`✅ 已開 issue:${(await r.json()).html_url}`);
}

// ── 4. 更新 state ──
if (!DRY_RUN) {
  mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
  writeFileSync(
    STATE_FILE,
    JSON.stringify(
      { lastReleaseId: releases[0].id, lastReleaseTag: releases[0].tag_name, checkedAt: new Date().toISOString() },
      null,
      2,
    ) + '\n',
  );
  console.log(`state 已更新 → ${releases[0].tag_name}`);
} else {
  console.log('\n[dry-run] 不更新 state 檔');
}
