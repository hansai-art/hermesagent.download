#!/usr/bin/env node
// 文章健康掃描器(免疫系統)— 移植 taiwan-md article-health.py 的外掛式設計。
// Phase 0 先落地骨架與基本外掛;Phase 2 依 docs/editorial/ 規範持續擴充。
//
// 用法:
//   node scripts/tools/article-health.mjs           # 掃 knowledge/ 全部
//   node scripts/tools/article-health.mjs --all     # 同上(相容 taiwan-md 慣例)
//   node scripts/tools/article-health.mjs 檔案.md   # 只掃指定檔案
//
// 回傳:有 ERROR 時 exit 1(CI 據此擋 PR);WARN 不擋。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const KNOWLEDGE = join(REPO_ROOT, 'knowledge');

// ── 外掛:每個 check 收 { file, data, content },回傳 issue 陣列 ──

const REQUIRED_FIELDS = ['title', 'description', 'date'];

const checks = [
  // frontmatter 必填欄位
  function requiredFrontmatter({ data }) {
    return REQUIRED_FIELDS.filter((f) => !data[f]).map((f) => ({
      level: 'ERROR',
      msg: `frontmatter 缺少必填欄位 \`${f}\``,
    }));
  },

  // status 合法值
  function validStatus({ data }) {
    const valid = ['draft', 'published', 'outdated', 'archived'];
    if (data.status && !valid.includes(data.status)) {
      return [{ level: 'ERROR', msg: `status \`${data.status}\` 不合法(${valid.join('/')})` }];
    }
    return [];
  },

  // 技術文章要有來源:published 文章至少一筆 upstream_refs 或 sources
  function hasSources({ data }) {
    const status = data.status ?? 'published';
    if (status !== 'published') return [];
    const refs = (data.upstream_refs?.length ?? 0) + (data.sources?.length ?? 0);
    if (refs === 0) {
      return [{ level: 'WARN', msg: '沒有 upstream_refs / sources,技術宣稱應對得到來源' }];
    }
    return [];
  },

  // code fence 要標語言(裸 ``` 讓讀者無法辨識平台,也讓 highlighter 失效)
  function codeFenceLang({ content }) {
    const issues = [];
    const lines = content.split('\n');
    let inFence = false;
    lines.forEach((line, i) => {
      const m = line.match(/^```(\S*)/);
      if (!m) return;
      if (!inFence && m[1] === '') {
        issues.push({ level: 'WARN', msg: `L${i + 1}: code fence 未標語言` });
      }
      inFence = !inFence;
    });
    return issues;
  },

  // 空洞句偵測(塑膠掃描的最小版,詞庫之後從 docs/editorial/EDITORIAL.md 持續擴充)
  function hollowPhrases({ content }) {
    const HOLLOW = [
      '在當今快速發展的時代',
      '眾所周知',
      '不可或缺的一環',
      '扮演著重要的角色',
      '值得一提的是',
      '總而言之',
    ];
    return HOLLOW.filter((p) => content.includes(p)).map((p) => ({
      level: 'WARN',
      msg: `疑似空洞句:「${p}」`,
    }));
  },

  // last_verified 過期偵測(> 90 天標 WARN;FRESHNESS pipeline 的本地版)
  function freshness({ data }) {
    if (!data.last_verified) return [];
    const days = (Date.now() - new Date(data.last_verified).getTime()) / 86400000;
    if (days > 90) {
      return [{ level: 'WARN', msg: `last_verified 已 ${Math.floor(days)} 天,建議重新驗證` }];
    }
    return [];
  },
];

// ── 掃描 ──

function* walkMd(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkMd(p);
    else if (name.endsWith('.md')) yield p;
  }
}

const args = process.argv.slice(2).filter((a) => a !== '--all');
const targets = args.length
  ? args.map((a) => resolve(a))
  : existsSync(KNOWLEDGE)
    ? [...walkMd(KNOWLEDGE)]
    : [];

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
    check({ file, data: parsed.data, content: parsed.content }),
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
console.log(`📊 scanned ${scanned} files — ${errors} error(s), ${warns} warning(s)`);
process.exit(errors > 0 ? 1 : 0);
