// 共用:讀取 knowledge/ 全部文章(pipeline 腳本用)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const KNOWLEDGE = join(REPO_ROOT, 'knowledge');

// 教學/操作類分類(FRESHNESS 只對這些做 status 翻轉;issues 卡片另計)
export const VERIFIED_CATEGORIES = ['install', 'config', 'guides', 'troubleshoot', 'migrate', 'integrations'];

export function* walkMd(dir = KNOWLEDGE) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkMd(p);
    else if (name.endsWith('.md')) yield p;
  }
}

export function loadArticles() {
  const articles = [];
  for (const file of walkMd()) {
    const rel = relative(KNOWLEDGE, file).replaceAll('\\', '/');
    const parsed = matter(readFileSync(file, 'utf-8'));
    articles.push({
      file,
      rel,
      category: rel.split('/')[0],
      slug: rel.split('/').slice(1).join('/').replace(/\.md$/, ''),
      data: parsed.data,
      content: parsed.content,
    });
  }
  return articles;
}

export function daysSince(date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}
