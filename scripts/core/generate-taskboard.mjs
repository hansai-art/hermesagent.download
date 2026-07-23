#!/usr/bin/env node
// 任務看板:把「我想幫忙但不知道從何下手」變成一個可點的清單。
// → data/taskboard.json
//
// 三種任務,都是從真實資料算出來的,不是人工維護的願望清單:
//   1. 缺口(gap)      — 文章數不足的分類,寫一篇就能明顯改變樣貌
//   2. 待驗證(verify) — last_verified 最舊的教學,最需要有人實測一輪
//   3. 待補來源(cite) — 沒有 upstream_refs 的文章
//   4. 草稿(draft)    — 已開頭但沒寫完的文章
//
// 用法:node scripts/core/generate-taskboard.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, VERIFIED_CATEGORIES, daysSince, loadArticles } from '../tools/lib/knowledge.mjs';
import { CATEGORIES, getCategory } from '../../src/config/categories.mjs';

const REPO = 'hansai-art/hermesagent.download';
const articles = loadArticles();
const live = articles.filter((a) => {
  const s = a.data.status ?? 'published';
  return s !== 'archived';
});

const editUrl = (a) => `https://github.com/${REPO}/edit/main/knowledge/${a.rel}`;

// 1. 分類缺口
const gaps = CATEGORIES.map((c) => ({
  ...c,
  count: live.filter((a) => a.category === c.slug && (a.data.status ?? 'published') === 'published').length,
}))
  .filter((c) => c.count < 3)
  .sort((a, b) => a.count - b.count)
  .map((c) => ({
    type: 'gap',
    category: c.slug,
    emoji: c.emoji,
    title: `${c.name}:目前只有 ${c.count} 篇`,
    hint: c.description,
    url: `/${c.slug}/`,
  }));

// 2. 待重新驗證(最舊優先 — 學 taiwan-md 的「待免疫清單」)
const verify = live
  .filter(
    (a) =>
      VERIFIED_CATEGORIES.includes(a.category) &&
      (a.data.status ?? 'published') === 'published' &&
      a.data.last_verified,
  )
  .map((a) => ({ a, days: daysSince(a.data.last_verified) }))
  .sort((x, y) => y.days - x.days)
  .slice(0, 12)
  .map(({ a, days }) => ({
    type: 'verify',
    category: a.category,
    emoji: getCategory(a.category)?.emoji ?? '📄',
    title: a.data.title,
    hint: `最後實測 ${days} 天前`,
    days,
    url: `/${a.category}/${a.slug}/`,
    editUrl: editUrl(a),
  }));

// 3. 待補來源
const cite = live
  .filter((a) => (a.data.status ?? 'published') === 'published')
  .filter((a) => (a.data.upstream_refs?.length ?? 0) + (a.data.sources?.length ?? 0) === 0)
  .slice(0, 10)
  .map((a) => ({
    type: 'cite',
    category: a.category,
    emoji: getCategory(a.category)?.emoji ?? '📄',
    title: a.data.title,
    hint: '缺官方來源連結',
    url: `/${a.category}/${a.slug}/`,
    editUrl: editUrl(a),
  }));

// 4. 未完成的草稿
const drafts = live
  .filter((a) => a.data.status === 'draft')
  .map((a) => ({
    type: 'draft',
    category: a.category,
    emoji: getCategory(a.category)?.emoji ?? '📄',
    title: a.data.title,
    hint: '草稿待補完',
    url: `/${a.category}/${a.slug}/`,
    editUrl: editUrl(a),
  }));

const board = {
  generatedAt: new Date().toISOString(),
  counts: { gaps: gaps.length, verify: verify.length, cite: cite.length, drafts: drafts.length },
  gaps,
  verify,
  cite,
  drafts,
};

mkdirSync(join(REPO_ROOT, 'data'), { recursive: true });
writeFileSync(join(REPO_ROOT, 'data', 'taskboard.json'), JSON.stringify(board, null, 2) + '\n');
console.log(
  `📋 任務看板:缺口 ${gaps.length} 個.待驗證 ${verify.length} 篇.待補來源 ${cite.length} 篇.草稿 ${drafts.length} 篇`,
);
