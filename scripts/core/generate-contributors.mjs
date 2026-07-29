#!/usr/bin/env node
// 貢獻者資料:GitHub API → data/contributors.json
//
// 「展現貢獻者」是共筆專案最基本的回饋機制——有人願意花時間寫,
// 至少要讓他的名字被看見。這份資料同時供貢獻者牆與儀表板使用。
//
// 但只列名字不夠。這份資料刻意多抓 GitHub public profile 的
// bio / 個人網站 / 公司 / 位置,並算出每個人實際貢獻了哪幾篇文章——
// 目的是讓 /contributors/ 能真的幫貢獻者宣傳(尤其是那條回到他們
// 自己網站的連結),而不是只發一枚頭像。
//
// 用法:node scripts/core/generate-contributors.mjs
//   有 GITHUB_TOKEN 時額度較高(5000/hr);沒有也能跑(60/hr),
//   但上游開發者區塊會被略過——它一人一次呼叫,60/hr 撐不住。
//
// ⚠️ 文章歸屬需要完整 git 歷史。CI 的 actions/checkout 預設是淺層
//    clone(depth=1),所以 .github/workflows/stats.yml 必須帶
//    fetch-depth: 0,否則這一段會靜靜地算出空結果。

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, loadArticles } from '../tools/lib/knowledge.mjs';

const REPO = process.env.GITHUB_REPOSITORY || 'hansai-art/hermesagent.download';
const UPSTREAM = 'NousResearch/hermes-agent';
const UPSTREAM_LIMIT = 40;
const COMMIT_PAGES = 5; // 每頁 100,上限 500 個 commit

const hasToken = Boolean(process.env.GITHUB_TOKEN);
const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'hermesagent-download-contributors',
  ...(hasToken ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${path}: HTTP ${res.status}`);
  return res.json();
}

// 空字串與 null 一律正規化成 null,頁面才能用「有沒有值」決定要不要渲染。
// GitHub profile 這幾個欄位很多人沒填,實測 teknium1 的 blog/company/location 全空。
const clean = (v) => {
  const s = typeof v === 'string' ? v.trim() : v;
  return s ? s : null;
};

// blog 欄位常常沒帶 protocol(例如 "example.com"),補上才能當 href 用
const normalizeBlog = (v) => {
  const s = clean(v);
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};

// 個別 profile 抓失敗不能中斷整支腳本(比照下面 recentCommits / repoInfo 的降級寫法)
async function fetchProfile(login) {
  try {
    const u = await gh(`users/${login}`);
    return {
      name: clean(u.name),
      bio: clean(u.bio),
      blog: normalizeBlog(u.blog),
      company: clean(u.company),
      location: clean(u.location),
    };
  } catch (e) {
    console.error(`⚠️  profile 抓取失敗(非致命):${login} — ${e.message}`);
    return { name: null, bio: null, blog: null, company: null, location: null };
  }
}

// ── 1. 本站貢獻者(依 commit 數) ───────────────────────────────────
const raw = await gh(`repos/${REPO}/contributors?per_page=100`);
const contributors = raw
  .filter((c) => c.type === 'User' && !/\[bot\]$/.test(c.login))
  .map((c) => ({
    login: c.login,
    avatar: c.avatar_url,
    url: c.html_url,
    contributions: c.contributions,
  }));

for (const c of contributors) Object.assign(c, await fetchProfile(c.login));

// ── 2. 每個人實際貢獻了哪幾篇文章 ─────────────────────────────────
// 用 commit sha 對接,不用 email 比對:同一個人可能有 "hans" / "Hans" 兩種
// author name,以及 GitHub 網頁編輯產生的 noreply 信箱,email 對不齊。
function localCommitFiles() {
  const out = execFileSync(
    'git',
    ['log', '--format=%H', '--name-only', '--', 'knowledge/'],
    {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  const map = new Map();
  let sha = null;
  for (const line of out.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (/^[0-9a-f]{40}$/.test(t)) {
      sha = t;
      map.set(sha, []);
    } else if (sha) {
      map.get(sha).push(t);
    }
  }
  return map;
}

async function shaToLogin() {
  const map = new Map();
  let truncated = true;
  for (let page = 1; page <= COMMIT_PAGES; page++) {
    const commits = await gh(`repos/${REPO}/commits?per_page=100&page=${page}`);
    for (const c of commits)
      if (c.author?.login) map.set(c.sha, c.author.login);
    if (commits.length < 100) {
      truncated = false;
      break;
    }
  }
  if (truncated) {
    console.error(
      `⚠️  commit 清單只讀到前 ${COMMIT_PAGES * 100} 筆,更早的貢獻不列入文章歸屬`,
    );
  }
  return map;
}

const articleByPath = new Map(
  loadArticles().map((a) => [
    `knowledge/${a.rel}`,
    {
      slug: a.slug,
      category: a.category,
      title: a.data.title ?? a.slug,
      url: `/${a.category}/${a.slug}/`,
    },
  ]),
);

try {
  const files = localCommitFiles();
  if (files.size <= 1) {
    console.error(
      '⚠️  git 歷史看起來是淺層 clone,文章歸屬會不完整(CI 需 fetch-depth: 0)',
    );
  }
  const logins = await shaToLogin();
  const byLogin = new Map();
  for (const [sha, paths] of files) {
    const login = logins.get(sha);
    if (!login) continue;
    if (!byLogin.has(login)) byLogin.set(login, new Map());
    for (const p of paths) {
      // 只算目前還存在的文章,改名或刪掉的自然被濾掉
      const art = articleByPath.get(p);
      if (art) byLogin.get(login).set(art.url, art);
    }
  }
  // 不排序:git log 是新到舊,Map 保留插入順序,所以陣列天然是「最近碰過的在前」。
  // 頁面只列前幾篇,依時間才有意義(依字母排會列出一堆不相干的舊文)。
  for (const c of contributors) {
    c.articles = [...(byLogin.get(c.login)?.values() ?? [])];
  }
} catch (e) {
  console.error(`⚠️  文章歸屬計算失敗(非致命):${e.message}`);
  for (const c of contributors) c.articles = [];
}

// ── 3. 近期活動(讓儀表板看得出「這個站是活的」) ────────────────────
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

// ── 4. repo 概況 ──────────────────────────────────────────────────
let repoInfo = {};
try {
  const r = await gh(`repos/${REPO}`);
  repoInfo = {
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
  };
} catch (e) {
  console.error(`⚠️  repo 資訊抓取失敗(非致命):${e.message}`);
}

// ── 5. 上游 Hermes Agent 開發者 ───────────────────────────────────
// 這個站是非官方中文入口,內容全部建立在上游開發者的成果上。列出他們並
// 連回本人 profile,是最起碼的歸屬。資料一律取自 GitHub 公開 profile。
// 一人一次 API 呼叫,沒有 token 的 60/hr 撐不住,所以無 token 直接略過。
let upstream = [];
if (hasToken) {
  try {
    const rawUpstream = await gh(`repos/${UPSTREAM}/contributors?per_page=100`);
    const top = rawUpstream
      .filter((c) => c.type === 'User' && !/\[bot\]$/.test(c.login))
      .slice(0, UPSTREAM_LIMIT);
    for (const c of top) {
      upstream.push({
        login: c.login,
        avatar: c.avatar_url,
        url: c.html_url,
        contributions: c.contributions,
        ...(await fetchProfile(c.login)),
      });
    }
  } catch (e) {
    console.error(`⚠️  上游貢獻者抓取失敗(非致命):${e.message}`);
  }
} else {
  console.error('ℹ️  無 GITHUB_TOKEN,略過上游開發者區塊(額度不足)');
}

const out = {
  generatedAt: new Date().toISOString(),
  repo: REPO,
  total: contributors.length,
  contributors,
  activity: { recentCommits30d: recentCommits, lastCommitAt },
  ...repoInfo,
  upstream: { repo: UPSTREAM, total: upstream.length, contributors: upstream },
};

mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
writeFileSync(
  join(REPO_ROOT, 'data', 'contributors.json'),
  JSON.stringify(out, null, 2) + '\n',
);

const withArticles = contributors.filter((c) => c.articles?.length).length;
console.log(
  `👥 ${contributors.length} 位貢獻者(${withArticles} 位有文章歸屬).` +
    `上游 ${upstream.length} 位.近 30 天 ${recentCommits} 次 commit`,
);
