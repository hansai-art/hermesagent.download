#!/usr/bin/env node
// 建置站內搜尋索引:knowledge/ → public/api/search-index.json
//
// 產出的是「已序列化的 minisearch 索引」,前端載入後即可查詢,不需在瀏覽器重建。
// 內文只取前 600 字進索引(壓體積;技術文件的關鍵詞多半在前半段)。
//
// 用法:node scripts/core/build-search-index.mjs

import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import MiniSearch from 'minisearch';
import { REPO_ROOT, loadArticles } from '../tools/lib/knowledge.mjs';
import { SEARCH_OPTIONS } from '../../src/lib/search-tokenizer.mjs';

const BODY_CHARS = 600;

const docs = loadArticles()
  .filter((a) => {
    const s = a.data.status ?? 'published';
    return s !== 'draft' && s !== 'archived';
  })
  .map((a, i) => ({
    id: i,
    url: `/${a.category}/${a.slug}/`,
    title: a.data.title ?? a.slug,
    description: a.data.description ?? '',
    category: a.category,
    status: a.data.status ?? 'published',
    tags: (a.data.tags ?? []).join(' '),
    body: a.content
      .replace(/```[\s\S]*?```/g, ' ') // 去掉 code block(雜訊多)
      .replace(/[#*_>[\]()`|-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, BODY_CHARS),
  }));

const mini = new MiniSearch(SEARCH_OPTIONS);
mini.addAll(docs);

const outDir = join(REPO_ROOT, 'public', 'api');
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, 'search-index.json');
writeFileSync(outFile, JSON.stringify(mini));

const kb = Math.round(statSync(outFile).size / 1024);
console.log(`🔍 搜尋索引:${docs.length} 篇 → public/api/search-index.json(${kb} KB)`);
