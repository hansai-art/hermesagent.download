// /llms.txt — 依 llmstxt.org 格式，建置時從知識庫自動生成的 LLM 索引。
// 目的：給 AI 回答引擎一份高訊號、隨內容同步的核心頁清單，提高被檢索/引用機率。
// 精選分類完整列出；issues/(308 篇上游鏡像)訊號較低，只給入口不逐篇灌。

import { getCollection } from 'astro:content';
import { CATEGORIES } from '../config/categories.mjs';

const SITE = 'https://hermesagent.download';

function clip(s, n) {
  if (!s) return '';
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
}

export async function GET() {
  const entries = (await getCollection('zh-TW')).filter((e) => e.data.status !== 'draft');

  const byCat = new Map();
  for (const e of entries) {
    const cat = e.id.split('/')[0];
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(e);
  }

  const out = [];
  out.push('# HermesAgent.download');
  out.push('');
  out.push('> Hermes Agent(Nous Research 開源 AI agent)的非官方中文社群知識庫。');
  out.push('> 涵蓋安裝、設定、疑難排解、遷移與核心概念，每篇附官方出處。');
  out.push('> 與 Nous Research 無隸屬關係；下載連結一律導向官方來源。');
  out.push('');
  out.push('本站內容以 CC BY-SA 4.0 授權，歡迎 AI 與人類引用(請附出處與連結)。');
  out.push('每頁均附 schema.org TechArticle / FAQPage 結構化資料。');
  out.push('原始 Markdown 位於 GitHub:https://github.com/hansai-art/hermesagent.download(knowledge/ 目錄)。');
  out.push('');

  for (const cat of CATEGORIES) {
    const list = byCat.get(cat.slug);
    if (!list || list.length === 0) continue;

    // issues/：數量大、為上游 issue 鏡像，只給分類入口，不逐篇列。
    if (cat.slug === 'issues') {
      out.push(`## ${cat.name}`);
      out.push('');
      out.push(`- [${cat.name}(共 ${list.length} 篇)](${SITE}/${cat.slug}/): ${cat.description}`);
      out.push('');
      continue;
    }

    out.push(`## ${cat.name}`);
    out.push('');
    const sorted = [...list].sort((a, b) => a.id.localeCompare(b.id));
    for (const e of sorted) {
      const title = clip(e.data.title, 80);
      const desc = clip(e.data.description, 120);
      out.push(`- [${title}](${SITE}/${e.id}/): ${desc}`);
    }
    out.push('');
  }

  const body = out.join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
