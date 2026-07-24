#!/usr/bin/env node
// UPSTREAM-WATCH pipeline:監看上游 release,自動開「可直接動工」的草稿任務 issue。
// 這是零成本代謝系統的核心——pipeline 本身不呼叫任何 LLM(不花錢),
// 而是把 release notes 加上一段現成 prompt 包成 issue,
// 由人、或由貢獻者捐出的 AI 額度把它變成中文版本情報文章。
//
// 流程:
//   1. 抓 NousResearch/hermes-agent 最新 releases
//   2. 與 data/upstream-state.json 比對,找出新 release
//   3. 有新 release → 開 issue(label: upstream-release),內含:
//      (a) 「把新版寫成一篇中文情報」的可貼 prompt + 完整 release notes
//      (b) 可能因這一版而過期、需要重新驗證的既有文章清單
//   4. 更新 state 檔(workflow 會 commit)
//
// 用法:
//   node scripts/tools/upstream-watch.mjs            # CI(需 GITHUB_TOKEN + GITHUB_REPOSITORY)
//   node scripts/tools/upstream-watch.mjs --dry-run  # 本地測試,只印不開 issue

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, VERIFIED_CATEGORIES, loadArticles } from './lib/knowledge.mjs';

const UPSTREAM = 'NousResearch/hermes-agent';
const SELF_REPO = process.env.GITHUB_REPOSITORY || 'hansai-art/hermesagent.download';
const STATE_FILE = join(REPO_ROOT, 'data', 'upstream-state.json');
const DRY_RUN = process.argv.includes('--dry-run') || !process.env.GITHUB_REPOSITORY;
const PROMPT_RAW = `https://raw.githubusercontent.com/${SELF_REPO}/main/RELEASE_PROMPT.md`;

// 版號 → 檔名 slug(點改連字號):v2026.7.20 → v2026-7-20
const tagSlug = (tag) => tag.replace(/\./g, '-');

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
  const slug = tagSlug(release.tag_name);
  const notes = (release.body ?? '(無說明)').slice(0, 6000);
  // 貼給 AI 的 prompt:把 release notes 帶進去,AI 讀 RELEASE_PROMPT.md 後產出文章
  const pastePrompt = [
    `讀取 ${PROMPT_RAW} 的完整內容,按照裡面的指示,`,
    `把下面這份 Hermes Agent ${release.tag_name} 的 release notes 寫成一篇中文版本情報,`,
    `檔名 releases/${slug}.md。release notes 如下:`,
    '',
    '---',
    notes,
  ].join('\n');

  const lines = [
    `上游發布了 **[${release.tag_name}](${release.html_url})**(${release.published_at?.slice(0, 10) ?? ''})。`,
    '',
    '這個 issue 是一個**可以直接動工的任務**,不只是提醒。有兩件事可以做:',
    '',
    '## 🅐 把這一版寫成一篇中文版本情報',
    '',
    `目前 \`releases/\` 分類需要為每個新版補一篇中文解讀。你不用自己從頭寫——`,
    `把下面整段貼給 ChatGPT / Claude / Gemini,它會讀完編輯規範、產出可直接 PR 的文章。`,
    `**你連一個字都不用寫**(這也是「捐出 AI 額度」的用法)。`,
    '',
    '<details><summary>📋 點開,複製整段貼給你的 AI</summary>',
    '',
    '````',
    pastePrompt,
    '````',
    '',
    '</details>',
    '',
    `產出後存成 \`knowledge/releases/${slug}.md\`,開 PR 即可。`,
    `範例參考:[\`releases/v2026-7-20.md\`](https://github.com/${SELF_REPO}/blob/main/knowledge/releases/v2026-7-20.md)。`,
    '',
    `## 🅑 檢查既有文章有沒有被這一版改到(${affected.length} 篇)`,
    '',
    '教學/操作類文章請對照上面的 release notes 檢查;確認仍正確就更新 `last_verified`,',
    '已失效就修文或標 `status: outdated`。挑一篇認領:在下方留言,或直接點檔名旁的編輯連結。',
    '',
  ];
  for (const a of affected.slice(0, 30)) {
    lines.push(
      `- [ ] [\`${a.rel}\`](https://github.com/${SELF_REPO}/edit/main/knowledge/${a.rel})` +
        `(${a.data.title};版本 ${a.data.hermes_version ?? '*'};最後驗證 ${a.data.last_verified ? String(a.data.last_verified).slice(0, 10) : '—'})`,
    );
  }
  if (affected.length > 30) lines.push(`- …以及其他 ${affected.length - 30} 篇(見 knowledge/)`);
  lines.push(
    '',
    '---',
    '*此 issue 由 UPSTREAM-WATCH pipeline 自動建立。pipeline 本身不呼叫 LLM、不花錢——',
    '草稿由人或貢獻者的 AI 額度產出,經 PR 審核後才合併。*',
  );
  return lines.join('\n');
}

for (const release of fresh.reverse()) {
  const title = `📰 ${release.tag_name} 版本情報待撰 + 文章驗證`;
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
