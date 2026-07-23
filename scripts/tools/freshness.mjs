#!/usr/bin/env node
// FRESHNESS pipeline:掃 last_verified 過期的教學文章,自動翻轉 status。
// 「自動進化」機制的新陳代謝——過期內容自動降級,重新驗證後自動回升。
//
//   published + last_verified 超過門檻 → outdated(網站顯示「可能過期」橫幅)
//   outdated  + last_verified 在門檻內 → published(有人重新驗證過就自動復活)
//
// 用法:
//   node scripts/tools/freshness.mjs           # 報告模式,只列不改
//   node scripts/tools/freshness.mjs --apply   # 實際改 frontmatter(CI 每週跑)
//   FRESHNESS_DAYS=120 node ...                # 覆寫門檻(預設 90 天)

import { readFileSync, writeFileSync } from 'node:fs';
import { VERIFIED_CATEGORIES, daysSince, loadArticles } from './lib/knowledge.mjs';

const THRESHOLD = Number(process.env.FRESHNESS_DAYS ?? 90);
const APPLY = process.argv.includes('--apply');

const flipped = { toOutdated: [], toPublished: [] };

for (const a of loadArticles()) {
  if (!VERIFIED_CATEGORIES.includes(a.category)) continue;
  if (!a.data.last_verified) continue;
  const status = a.data.status ?? 'published';
  const stale = daysSince(a.data.last_verified) > THRESHOLD;

  let next = null;
  if (status === 'published' && stale) next = 'outdated';
  if (status === 'outdated' && !stale) next = 'published';
  if (!next) continue;

  (next === 'outdated' ? flipped.toOutdated : flipped.toPublished).push(a);
  if (APPLY) {
    const md = readFileSync(a.file, 'utf-8');
    const updated = md.replace(/^status:\s*["']?\w+["']?\s*$/m, `status: "${next}"`);
    if (updated === md) {
      console.error(`⚠️  ${a.rel}: 找不到 status 欄位可改,跳過`);
      continue;
    }
    writeFileSync(a.file, updated);
  }
}

const mode = APPLY ? 'APPLY' : 'report-only';
console.log(`🕰️  FRESHNESS(門檻 ${THRESHOLD} 天,mode=${mode})`);
for (const a of flipped.toOutdated) {
  console.log(`  📉 ${a.rel} → outdated(最後驗證 ${String(a.data.last_verified).slice(0, 10)},${daysSince(a.data.last_verified)} 天前)`);
}
for (const a of flipped.toPublished) {
  console.log(`  📈 ${a.rel} → published(已重新驗證)`);
}
if (flipped.toOutdated.length + flipped.toPublished.length === 0) {
  console.log('  ✅ 沒有需要翻轉的文章');
}

// 給 workflow 的機器可讀輸出
console.log(`\nFLIPPED_COUNT=${flipped.toOutdated.length + flipped.toPublished.length}`);
