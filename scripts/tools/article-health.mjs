#!/usr/bin/env node
// 文章健康掃描器(免疫系統)— 移植 taiwan-md article-health.py 的外掛式設計。
//
// 用法:
//   node scripts/tools/article-health.mjs                      # 掃 knowledge/ 全部
//   node scripts/tools/article-health.mjs 檔案.md [檔案2.md]   # 只掃指定檔案(lint-staged 用)
//   node scripts/tools/article-health.mjs --profile=release-pr # 嚴格模式:WARN 也視為失敗
//
// 回傳:有 ERROR 時 exit 1(CI 據此擋 PR);release-pr profile 下 WARN 也算。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const KNOWLEDGE = join(REPO_ROOT, 'knowledge');

// ── 共用 context:整個 knowledge/ 的路由表(內部連結解析用)──

function* walkMd(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkMd(p);
    else if (name.endsWith('.md')) yield p;
  }
}

function buildRouteSet() {
  const routes = new Set(['/']);
  if (!existsSync(KNOWLEDGE)) return routes;
  for (const file of walkMd(KNOWLEDGE)) {
    const rel = relative(KNOWLEDGE, file).replaceAll('\\', '/');
    const parts = rel.split('/');
    if (parts.length < 2) continue;
    const category = parts[0];
    const slug = parts.slice(1).join('/').replace(/\.md$/, '');
    routes.add(`/${category}/`);
    routes.add(`/${category}/${slug}/`);
  }
  return routes;
}

// ── 檢查外掛:每個 check 收 { file, data, content, ctx },回傳 issue 陣列 ──

const REQUIRED_FIELDS = ['title', 'description', 'date'];

// 需要 last_verified 的分類(教學/操作類;issues 卡片本來就有)
const VERIFIED_CATEGORIES = ['install', 'config', 'guides', 'troubleshoot', 'migrate', 'integrations'];

// 譯名表的禁用寫法(docs/editorial/TERMINOLOGY.md;新增禁用詞兩邊一起加)
const BANNED_TERMS = [
  { re: /服务器/g, fix: '伺服器' },
  { re: /缺省/g, fix: '預設' },
  { re: /小白/g, fix: '新手' },
  { re: /让我们/g, fix: '(重寫為自然中文)' },
  // 只放「簡體獨有、繁體文本不可能出現」的字;正簡共用字(件/行/量/境/置…)絕不可加
  { re: /[优统专业务动经处开发过们记页头条频软网络设错误问题启运环变电脑议价适龄检测试历]/g, fix: null, label: '疑似簡體字' },
];

const checks = [
  function requiredFrontmatter({ data }) {
    return REQUIRED_FIELDS.filter((f) => !data[f]).map((f) => ({
      level: 'ERROR',
      msg: `frontmatter 缺少必填欄位 \`${f}\``,
    }));
  },

  function validStatus({ data }) {
    const valid = ['draft', 'published', 'outdated', 'archived'];
    if (data.status && !valid.includes(data.status)) {
      return [{ level: 'ERROR', msg: `status \`${data.status}\` 不合法(${valid.join('/')})` }];
    }
    return [];
  },

  // published 文章至少一筆 upstream_refs 或 sources
  function hasSources({ data }) {
    const status = data.status ?? 'published';
    if (status !== 'published') return [];
    const refs = (data.upstream_refs?.length ?? 0) + (data.sources?.length ?? 0);
    if (refs === 0) {
      return [{ level: 'WARN', msg: '沒有 upstream_refs / sources,技術宣稱應對得到來源' }];
    }
    return [];
  },

  // 教學/操作類 published 文章必須有 last_verified(自動進化機制的施力點)
  function requiresLastVerified({ file, data }) {
    const status = data.status ?? 'published';
    if (status !== 'published') return [];
    const category = relative(KNOWLEDGE, file).replaceAll('\\', '/').split('/')[0];
    if (!VERIFIED_CATEGORIES.includes(category)) return [];
    if (!data.last_verified) {
      return [{ level: 'WARN', msg: `${category}/ 的 published 文章應有 last_verified(最後實測日期)` }];
    }
    return [];
  },

  // code fence 要標語言
  function codeFenceLang({ content }) {
    const issues = [];
    let inFence = false;
    content.split('\n').forEach((line, i) => {
      const m = line.match(/^\s*```(\S*)/);
      if (!m) return;
      if (!inFence && m[1] === '') {
        issues.push({ level: 'WARN', msg: `L${i + 1}: code fence 未標語言` });
      }
      inFence = !inFence;
    });
    return issues;
  },

  // 裸 curl | sh:安裝指令要能看出來源與脈絡
  function nakedCurlPipe({ content }) {
    const issues = [];
    content.split('\n').forEach((line, i) => {
      if (/curl[^|]*\|\s*(sudo\s+)?(ba)?sh\b/.test(line)) {
        issues.push({
          level: 'WARN',
          msg: `L${i + 1}: curl | sh 一行流——請確認 URL 是官方來源,並在前後文說明它會做什麼`,
        });
      }
    });
    return issues;
  },

  // 內部連結解析:markdown 連結指向的站內路徑必須存在(否則上線就是 404)
  function internalLinks({ content, ctx }) {
    const issues = [];
    for (const m of content.matchAll(/\]\((\/[^)\s#?]*)/g)) {
      let path = m[1];
      if (!path.endsWith('/')) path += '/';
      if (!ctx.routes.has(path)) {
        issues.push({ level: 'ERROR', msg: `內部連結 404:${m[1]}` });
      }
    }
    return issues;
  },

  // 譯名/簡體偵測(TERMINOLOGY.md 的禁用寫法)
  function terminology({ content, data }) {
    const issues = [];
    const text = `${data.title ?? ''}\n${data.description ?? ''}\n${content}`;
    for (const { re, fix, label } of BANNED_TERMS) {
      const hits = [...text.matchAll(re)];
      if (hits.length === 0) continue;
      const sample = [...new Set(hits.map((h) => h[0]))].slice(0, 5).join('、');
      issues.push({
        level: 'WARN',
        msg: `${label ?? '禁用譯名'}:「${sample}」×${hits.length}${fix ? ` → 建議「${fix}」` : ''}(見 docs/editorial/TERMINOLOGY.md)`,
      });
    }
    return issues;
  },

  // 空洞句偵測(塑膠掃描)
  function hollowPhrases({ content }) {
    const HOLLOW = [
      '在當今快速發展的時代',
      '眾所周知',
      '不可或缺的一環',
      '扮演著重要的角色',
      '值得一提的是',
      '總而言之',
      '希望這篇文章對你有幫助',
    ];
    return HOLLOW.filter((p) => content.includes(p)).map((p) => ({
      level: 'WARN',
      msg: `疑似空洞句:「${p}」`,
    }));
  },

  // last_verified 過期偵測(> 90 天;FRESHNESS pipeline 的本地版)
  function freshness({ data }) {
    if (!data.last_verified) return [];
    const days = (Date.now() - new Date(data.last_verified).getTime()) / 86400000;
    if (days > 90) {
      return [{ level: 'WARN', msg: `last_verified 已 ${Math.floor(days)} 天,建議重新驗證` }];
    }
    return [];
  },
];

// ── 主流程 ──

const rawArgs = process.argv.slice(2);
const profile = (rawArgs.find((a) => a.startsWith('--profile=')) ?? '--profile=default').split('=')[1];
const fileArgs = rawArgs.filter((a) => !a.startsWith('--'));

const targets = fileArgs.length
  ? fileArgs.map((a) => resolve(a)).filter((p) => p.endsWith('.md'))
  : existsSync(KNOWLEDGE)
    ? [...walkMd(KNOWLEDGE)]
    : [];

const ctx = { routes: buildRouteSet() };

let errors = 0;
let warns = 0;
let scanned = 0;

for (const file of targets) {
  let parsed;
  try {
    parsed = matter(readFileSync(file, 'utf-8'));
  } catch (e) {
    console.log(`❌ ${relative(REPO_ROOT, file)}`);
    console.log(`   ERROR frontmatter 解析失敗:${e.message}`);
    errors++;
    continue;
  }
  scanned++;
  const issues = checks.flatMap((check) =>
    check({ file, data: parsed.data, content: parsed.content, ctx }),
  );
  if (issues.length === 0) continue;

  console.log(`${issues.some((i) => i.level === 'ERROR') ? '❌' : '⚠️ '} ${relative(REPO_ROOT, file)}`);
  for (const { level, msg } of issues) {
    console.log(`   ${level} ${msg}`);
    if (level === 'ERROR') errors++;
    else warns++;
  }
}

console.log('');
console.log(`📊 scanned ${scanned} files — ${errors} error(s), ${warns} warning(s) [profile=${profile}]`);
const failed = errors > 0 || (profile === 'release-pr' && warns > 0);
process.exit(failed ? 1 : 0);
