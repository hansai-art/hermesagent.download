#!/usr/bin/env node
// 外部連結存活檢查 — 掃 knowledge/ 內所有外部 URL,回報死鏈。
// 慢(要打真實網路),所以不進 PR CI;由排程 pipeline(Phase 3)每週跑,或手動:
//
//   npm run check-links               # 全部
//   npm run check-links -- --limit 50 # 抽查前 50 個 URL
//
// 死鏈(4xx/5xx/網路錯誤)列出後 exit 1;303/429/999 等反爬回應視為存活。

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const KNOWLEDGE = join(REPO_ROOT, 'knowledge');
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? Number(args[limitIdx + 1]) : Infinity;

function* walkMd(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkMd(p);
    else if (name.endsWith('.md')) yield p;
  }
}

// url → 使用它的檔案清單
const urlMap = new Map();
for (const file of walkMd(KNOWLEDGE)) {
  const text = readFileSync(file, 'utf-8');
  for (const m of text.matchAll(/https?:\/\/[^\s)"'\]<>,;，；]+/g)) {
    const url = m[0].replace(/[.,)。」]+$/, '');
    // 文件中的本機/內網範例端點(Ollama 等)不是外部連結
    if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|\[::1\])/.test(url)) continue;
    if (!urlMap.has(url)) urlMap.set(url, []);
    urlMap.get(url).push(relative(REPO_ROOT, file));
  }
}

const urls = [...urlMap.keys()].slice(0, LIMIT);
console.log(`🔗 檢查 ${urls.length} 個外部 URL(共出現於 ${urlMap.size} 個唯一連結)...`);

async function probe(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctl.signal });
    // 部分站不支援 HEAD → 再試 GET
    if (res.status === 405 || res.status === 501 || res.status === 404) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctl.signal });
    }
    // 反爬/限流回應不當作死鏈
    if ([403, 429, 999].includes(res.status)) return { url, ok: true, note: `bot-blocked ${res.status}` };
    return { url, ok: res.ok, status: res.status };
  } catch (e) {
    return { url, ok: false, status: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally {
    clearTimeout(timer);
  }
}

const dead = [];
let done = 0;
const queue = [...urls];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const r = await probe(url);
      done++;
      if (done % 50 === 0) console.log(`  … ${done}/${urls.length}`);
      if (!r.ok) dead.push(r);
    }
  }),
);

console.log('');
if (dead.length === 0) {
  console.log(`✅ ${urls.length} 個連結全部存活`);
  process.exit(0);
}
console.log(`💀 ${dead.length} 個死鏈:`);
for (const { url, status } of dead) {
  console.log(`  [${status}] ${url}`);
  for (const f of urlMap.get(url).slice(0, 3)) console.log(`      ← ${f}`);
}
process.exit(1);
