#!/usr/bin/env node
// HermesAgent.download 統一同步腳本:knowledge/ SSOT → src/content/ 投影層
//
// 設計(移植自 taiwan-md scripts/core/sync.sh,改寫為 Node 以支援 Windows):
//   - 啟用語言從 src/config/languages.mjs 讀取(SSOT)
//   - 分類清單從 src/config/categories.mjs 讀取(SSOT)
//   - zh-TW(預設語言): knowledge/{category}/ → src/content/zh-TW/{category}/
//   - 其他語言:         knowledge/{lang}/{category}/ → src/content/{lang}/{category}/
//   - 冪等:先清空所有啟用語言的目標目錄再重建
//
// 用法:node scripts/core/sync.mjs

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const { ENABLED_LANGUAGE_CODES, DEFAULT_LANGUAGE } = await import(
  pathToFileURL(join(REPO_ROOT, 'src/config/languages.mjs')).href
);
const { CATEGORY_SLUGS } = await import(
  pathToFileURL(join(REPO_ROOT, 'src/config/categories.mjs')).href
);

console.log('🚀 HermesAgent.download sync — knowledge/ SSOT → src/content/ 投影層');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Enabled langs: ${ENABLED_LANGUAGE_CODES.join(' ')}`);
console.log('');

// ── Phase 1: 清空(冪等重建)──
console.log('🧹 Phase 1: 清空 src/content/{lang}/ ...');
for (const lang of ENABLED_LANGUAGE_CODES) {
  const dir = join(REPO_ROOT, 'src/content', lang);
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}
console.log(`  ✅ Cleaned: ${ENABLED_LANGUAGE_CODES.join(' ')}`);
console.log('');

// ── Phase 2: 同步(per lang)──
let syncedTotal = 0;

function copyMdFiles(srcDir, dstDir) {
  if (!existsSync(srcDir)) return 0;
  let count = 0;
  mkdirSync(dstDir, { recursive: true });
  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith('.md')) continue;
    cpSync(join(srcDir, file), join(dstDir, file));
    count++;
  }
  return count;
}

function syncLang(lang) {
  // zh-TW 特例:source 在 knowledge/ 根層(不在 knowledge/zh-TW/)
  const srcRoot =
    lang === DEFAULT_LANGUAGE.code
      ? join(REPO_ROOT, 'knowledge')
      : join(REPO_ROOT, 'knowledge', lang);
  const dstRoot = join(REPO_ROOT, 'src/content', lang);

  if (!existsSync(srcRoot)) {
    console.log(`  ⚠️  ${lang}: SKIP (no source dir)`);
    return;
  }

  let count = 0;
  for (const category of CATEGORY_SLUGS) {
    count += copyMdFiles(join(srcRoot, category), join(dstRoot, category));
  }
  syncedTotal += count;
  console.log(`  ✅ ${lang.padEnd(6)} ${String(count).padStart(4)} files`);
}

console.log('📁 Phase 2: 同步 (per lang)...');
for (const lang of ENABLED_LANGUAGE_CODES) syncLang(lang);
console.log('');

console.log('═══════════════════════════════════════════════════════');
console.log('✨ Sync 完成');
console.log(`   📊 synced: ${syncedTotal} files`);
console.log('');
console.log('▶️  下一步:npm run build');
