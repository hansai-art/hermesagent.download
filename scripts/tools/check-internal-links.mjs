#!/usr/bin/env node
// 站內連結檢查 — 掃 dist/ 產出的 HTML,確認每個站內 href 真的有對應檔案。
//
// 為什麼要獨立一支:check-links.mjs 打真實網路、慢又受對方站況影響,作者
// 明寫「不進 PR CI」。站內連結不同——純檔案系統比對,毫秒級且完全確定性,
// 所以它可以(也應該)當 CI 閘門。
//
// 這支存在的理由是一個真實事故:/dashboard/ 有兩處連到 /about/貢獻指南/,
// 那頁從來沒建過。它就在「加入貢獻者」的 CTA 上,想貢獻的人點下去直接撞 404,
// 而且撐了很久沒被發現——因為當時沒有任何機制在看站內連結。
//
// 用法(要先 build):
//   npm run build && npm run check-internal
//
// 有壞連結時列出「哪一頁連向哪個不存在的路徑」並 exit 1。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = join(REPO_ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('❌ 找不到 dist/,請先跑 npm run build');
  process.exit(1);
}

function* walkHtml(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkHtml(p);
    else if (name.endsWith('.html')) yield p;
  }
}

// 站內路徑 → 實體檔案。三種都算存在:
//   /a/b/  → dist/a/b/index.html
//   /a/b   → dist/a/b/index.html(Astro 目錄式輸出,連結常省略尾斜線)
//   /x.txt → dist/x.txt(llms.txt、robots.txt、api/*.json、_astro/* 等)
function resolves(pathname) {
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '') return existsSync(join(DIST, 'index.html'));
  const target = join(DIST, clean);
  return existsSync(join(target, 'index.html')) || existsSync(target);
}

// 壞路徑 → 連向它的頁面清單
const broken = new Map();
let pages = 0;
let checked = 0;

for (const file of walkHtml(DIST)) {
  pages++;
  const html = readFileSync(file, 'utf-8');
  const from = relative(DIST, file);

  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const raw = m[1].trim();

    // 只看站內絕對路徑。外部連結歸 check-links.mjs 管;
    // // 開頭是 protocol-relative 的外部連結,不是站內路徑。
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;

    // 去掉 fragment 與 query 再比對
    const pathname = raw.split('#')[0].split('?')[0];
    if (!pathname) continue; // 純錨點 href="#foo"

    // 中文路徑在 HTML 裡是 percent-encoded,不解碼會全部誤判成壞連結
    let decoded;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      decoded = pathname; // 編碼壞掉的本身就是問題,交給下面的存在性檢查報出來
    }

    checked++;
    if (resolves(decoded)) continue;
    if (!broken.has(decoded)) broken.set(decoded, new Set());
    broken.get(decoded).add(from);
  }
}

console.log(`🔗 掃了 ${pages} 頁,檢查 ${checked} 個站內連結`);

if (broken.size === 0) {
  console.log('✅ 站內連結全部有對應檔案');
  process.exit(0);
}

console.log('');
console.log(`💀 ${broken.size} 個站內連結指向不存在的頁面:`);
for (const [path, sources] of broken) {
  console.log(`  ${path}`);
  for (const s of [...sources].slice(0, 5)) console.log(`      ← ${s}`);
  if (sources.size > 5) console.log(`      … 另有 ${sources.size - 5} 頁`);
}
process.exit(1);
