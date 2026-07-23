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

// Astro 的靜態頁面(不是 knowledge/ 產生的),內部連結檢查也要認得
const STATIC_ROUTES = ['/', '/contribute/', '/dashboard/', '/404/'];

function buildRouteSet() {
  const routes = new Set(STATIC_ROUTES);
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

// 引用密度檢查(依 CITATION-SYSTEM.md)。抽成獨立函式,讓最後的達成率統計
// 能重用同一套判準——否則統計與檢查會各說各話。
//   concepts/ 概念文 — 每 300 字至少 1 個 [^n] 腳註(概念容易憑印象亂寫,要求較嚴)
//   其餘 —— 每 400 字至少 1 個「引用」:腳註、upstream_refs、內文官方連結都算
function citationDensity({ file, data, content, ctx }) {
  if (!ctx.isSubstantial) return [];
  if ((data.status ?? 'published') !== 'published') return [];
  const category = relative(KNOWLEDGE, file).replaceAll('\\', '/').split('/')[0];
  const footnotes = (content.match(/^\[\^[^\]]+\]:/gm) ?? []).length;

  if (category === 'concepts') {
    const expected = Math.floor(ctx.charCount / 300);
    if (expected < 1) return [];
    if (footnotes < expected) {
      return [
        {
          level: 'WARN',
          msg: `概念文引用密度不足:${footnotes} 個腳註,${ctx.charCount} 字應有 ${expected} 個`,
        },
      ];
    }
    return [];
  }

  const expected = Math.floor(ctx.charCount / 400);
  if (expected < 1) return [];
  const refs = (data.upstream_refs?.length ?? 0) + (data.sources?.length ?? 0);
  // 內文直接連向官方來源的連結也算引用。目錄型文章(如 173 個 skill 的全目錄)
  // 每一條都內嵌官方 SKILL.md 連結,那本來就可追溯——
  // 硬要求另外寫 96 個腳註是形式主義,不是嚴謹。
  const inlineOfficial = new Set(
    (
      content.match(
        /https?:\/\/(?:hermes-agent\.nousresearch\.com|github\.com\/NousResearch|huggingface\.co\/NousResearch|modelcontextprotocol\.io)[^\s)"'\]]*/g,
      ) ?? []
    ).map((u) => u.split('#')[0]),
  ).size;
  const citations = footnotes + refs + inlineOfficial;
  if (citations === 0) {
    return [
      { level: 'WARN', msg: `${ctx.charCount} 字卻沒有任何引用(腳註、upstream_refs 或內文官方連結)` },
    ];
  }
  if (citations < expected) {
    return [
      {
        level: 'WARN',
        msg: `引用密度不足:${footnotes} 腳註 + ${refs} 來源 + ${inlineOfficial} 官方連結 = ${citations},${ctx.charCount} 字應有 ${expected} 個`,
      },
    ];
  }
  return [];
}

const checks = [
  citationDensity,

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

  // ── 以下是「編輯規範」檢查。
  // 之前的版本只檢查 frontmatter 有沒有填欄位,不檢查內容有沒有做到規範,
  // 導致掃描器回報 0 error 但實際內容大面積不符 docs/editorial/ 的要求。
  // 這幾項只對「實質文章」(400 字以上)生效,卡片式摘要不適用。──

  // 可跟做(EDITORIAL:每個關鍵步驟要寫預期輸出或成功判準)
  function followable({ file, content, ctx }) {
    const category = relative(KNOWLEDGE, file).replaceAll('\\', '/').split('/')[0];
    if (!VERIFIED_CATEGORIES.includes(category)) return [];
    const fences = (content.match(/^\s*```/gm) ?? []).length / 2;
    if (fences === 0) return [];
    const hasCheckpoint = /預期輸出|成功判準|完成判準|怎麼確認|確認成功|應該會看到|輸出會像|成功的話|跑完會|看什麼/.test(content);
    if (!hasCheckpoint) {
      return [
        {
          level: 'WARN',
          msg: `有 ${fences} 個指令區塊但沒寫預期輸出——讀者無法判斷自己做對了沒`,
        },
      ];
    }
    return [];
  },

  // 版本標註(技術文件的核心:沒標版本等於沒說適用範圍)
  function versionLabelled({ file, data, ctx }) {
    if (!ctx.isSubstantial) return [];
    const category = relative(KNOWLEDGE, file).replaceAll('\\', '/').split('/')[0];
    if (!VERIFIED_CATEGORIES.includes(category)) return [];
    if ((data.hermes_version ?? '*') === '*') {
      return [{ level: 'WARN', msg: 'hermes_version 未標明適用範圍(寫 * 等於沒標)' }];
    }
    return [];
  },

  // list-dump(EDITORIAL:列表只用於步驟、比較、檢查清單)
  function listDump({ content, ctx }) {
    if (!ctx.isSubstantial) return [];
    const lines = content.split('\n').filter((l) => l.trim());
    const listLines = lines.filter((l) => /^\s*([-*]|\d+[.)])\s/.test(l)).length;
    const ratio = listLines / Math.max(lines.length, 1);
    if (ratio > 0.6) {
      return [{ level: 'WARN', msg: `疑似 list-dump:${Math.round(ratio * 100)}% 的行是清單,缺少敘事` }];
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

// 編輯規範達成率統計(掃完後給一份總覽,避免只看到零散警告)
const editorial = {
  substantial: 0,
  citationOk: 0,
  teachingWithCode: 0,
  teachingWithCheckpoint: 0,
  versioned: 0,
  needsVersion: 0,
  humanReviewed: 0,
  published: 0,
};

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

  // 每篇的檢查脈絡:字數決定要不要套用「實質文章」等級的規範
  const charCount = parsed.content.replace(/```[\s\S]*?```/g, '').replace(/\s/g, '').length;
  const fileCtx = { ...ctx, charCount, isSubstantial: charCount >= 400 };

  // 統計
  const cat = relative(KNOWLEDGE, file).replaceAll('\\', '/').split('/')[0];
  const status = parsed.data.status ?? 'published';
  if (status === 'published') {
    editorial.published++;
    if (parsed.data.human_reviewed) editorial.humanReviewed++;
    if (fileCtx.isSubstantial) {
      editorial.substantial++;
      // 「符合引用規範」而非「有沒有腳註」——概念文要腳註,其餘 upstream_refs
      // 與內文官方連結也算(與 citationDensity 檢查同一套判準)
      if (citationDensity({ file, data: parsed.data, content: parsed.content, ctx: fileCtx }).length === 0)
        editorial.citationOk++;
      if (VERIFIED_CATEGORIES.includes(cat)) {
        editorial.needsVersion++;
        if ((parsed.data.hermes_version ?? '*') !== '*') editorial.versioned++;
      }
    }
    if (VERIFIED_CATEGORIES.includes(cat) && (parsed.content.match(/^\s*```/gm) ?? []).length >= 2) {
      editorial.teachingWithCode++;
      if (/預期輸出|成功判準|完成判準|怎麼確認|確認成功|應該會看到|輸出會像|成功的話|跑完會|看什麼/.test(parsed.content))
        editorial.teachingWithCheckpoint++;
    }
  }

  const issues = checks.flatMap((check) =>
    check({ file, data: parsed.data, content: parsed.content, ctx: fileCtx }),
  );
  if (issues.length === 0) continue;

  console.log(`${issues.some((i) => i.level === 'ERROR') ? '❌' : '⚠️ '} ${relative(REPO_ROOT, file)}`);
  for (const { level, msg } of issues) {
    console.log(`   ${level} ${msg}`);
    if (level === 'ERROR') errors++;
    else warns++;
  }
}

const pct = (n, d) => (d === 0 ? '—' : `${Math.round((n / d) * 100)}%`);

console.log('');
console.log(`📊 scanned ${scanned} files — ${errors} error(s), ${warns} warning(s) [profile=${profile}]`);

if (fileArgs.length === 0) {
  console.log('');
  console.log('📐 編輯規範達成率(對照 docs/editorial/)');
  console.log(
    `   引用密度   ${editorial.citationOk}/${editorial.substantial} 篇實質文章符合引用規範 (${pct(editorial.citationOk, editorial.substantial)})`,
  );
  console.log(
    `   可跟做     ${editorial.teachingWithCheckpoint}/${editorial.teachingWithCode} 篇教學有寫預期輸出 (${pct(editorial.teachingWithCheckpoint, editorial.teachingWithCode)})`,
  );
  console.log(
    `   版本標註   ${editorial.versioned}/${editorial.needsVersion} 篇標明適用版本 (${pct(editorial.versioned, editorial.needsVersion)})`,
  );
  console.log(
    `   人工審閱   ${editorial.humanReviewed}/${editorial.published} 篇有人讀過並認可 (${pct(editorial.humanReviewed, editorial.published)})`,
  );
}

const failed = errors > 0 || (profile === 'release-pr' && warns > 0);
process.exit(failed ? 1 : 0);
