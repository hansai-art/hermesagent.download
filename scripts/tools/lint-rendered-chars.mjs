#!/usr/bin/env node
/**
 * 掃 dist/ 的可見文字，擋掉四種「build 會過、狀態碼 200、但讀者看到錯東西」的字元問題。
 *
 * 背景（2026-07-30 全站量測，改前的實際數字）：
 *   1. 全形破折號 2,061 處，分佈在全部 391 頁。專案語氣規範禁止全形破折號，
 *      但這條規範從來沒有機器守過。
 *   2. 21 個 CLI 參數被印錯，分佈在 16 頁：Astro 的 smartypants 把正文裡的
 *      `--tui` 轉成 `—tui`、`--no-skills` 轉成 `—no-skills`、`--output-format`
 *      轉成 `—output-format`。讀者照抄一定失敗，而且使用者真正會搜的那串字
 *      根本不在頁面上。根因已修（astro.config.mjs 關掉 smartypants），
 *      這支負責讓它不會再回來。
 *   3. 亂碼 U+FFFD 1 處（頁尾連結分隔符）。
 *   4. 裸露的 `**粗體**` 1 處：`大多是**「這個東西你沒設定」**` 這種寫法，
 *      開頭的 `**` 前面是中文字、後面是全形引號時 CommonMark 不認它是粗體，
 *      星號會原樣印出來。`fixUnpairedBold` 之類的檢查抓不到，因為 `**` 個數是偶數。
 *
 * 破折號的例外規則（不是白名單檔案清單，是一條會自己成立的規則）：
 * 上游 release notes 的英文原句要逐字保留（改了等於偽造引文），
 * 例如「Hermes reaches iMessage — Photon Spectrum, no Mac relay required」。
 * 判準：破折號前後 30 字內完全沒有中文 = 英文引文，放行。
 * 只要那個破折號周圍有中文，就是我們自己寫的句子，一律要改成全形冒號或逗號。
 *
 * 反向測試（rule 57-3，2026-07-30 四項各自實測過）：
 *   在任一頁注入 `<p>中文破折號——測試</p>`、`<p>亂碼�</p>`、
 *   `<p>**粗體**測試</p>`、`<p>參數 —tui 測試</p>`，四項都必須各自報出來並 exit 1。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname), '../..');
const dist = join(root, 'dist');

function walk(dir, hit = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, hit);
    else if (full.endsWith('.html')) hit.push(full);
  }
  return hit;
}

const CJK = /[㐀-鿿　-〿＀-￯]/;

function stripFor(html, { dropCode }) {
  let s = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  if (dropCode) s = s.replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  return s.replace(/<[^>]+>/g, ' ');
}

/**
 * 破折號是否落在一段「完全沒有中文的引號內容」裡 = 上游 release notes 的英文原句。
 * 用最近的一組「」界定範圍，而不是固定寬度的視窗：前者才分得出
 * 「同上，Highlights：「Raft — Hermes joins…」」裡面哪一段是引文
 * （第一版用前後 30 字判斷，把外面的中文一起吃進來，17 條引文全部誤報）。
 */
function insideAsciiQuote(text, index) {
  const open = text.lastIndexOf('「', index);
  if (open === -1) return false;
  const close = text.indexOf('」', index);
  if (close === -1) return false;
  // 中間若還夾了另一組引號開頭，代表 index 不在同一組引號內
  if (text.slice(open + 1, index).includes('」')) return false;
  return !CJK.test(text.slice(open + 1, close));
}

let files;
try {
  files = walk(dist);
} catch {
  console.log('– 略過（無 dist，先跑 npm run build）');
  process.exit(0);
}

const findings = {
  '全形破折號（中文語境內，改用全形冒號或逗號）': [],
  '亂碼 U+FFFD': [],
  '裸露的 **粗體**（CommonMark 在中文標點旁不認粗體，把 ** 移到引號內側）': [],
  '被排版轉換吃掉的 CLI 參數（應為 --flag）': [],
  '腳註網址把括號與日期吃進去了（URL 與括號之間要留半形空白）': [],
};

for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  const rel = relative(dist, file);
  const all = stripFor(html, { dropCode: false });
  const prose = stripFor(html, { dropCode: true });

  for (const m of all.matchAll(/—/g)) {
    if (insideAsciiQuote(all, m.index)) continue; // 上游英文原文，逐字保留
    const window = all.slice(Math.max(0, m.index - 30), m.index + 31);
    // 只攔「中文語境內」的破折號(對齊本檔開頭第 21 行的判準):破折號前後 30 字
    // 內完全沒有中文 = 英文句子(含 /en/ 英文頁的正常 em-dash),放行。少了這道
    // gate,英文頁每個正常 em-dash 都會被誤攔。
    if (!CJK.test(window)) continue;
    findings['全形破折號（中文語境內，改用全形冒號或逗號）'].push([rel, window.trim()]);
  }

  for (const m of all.matchAll(/�/g)) {
    findings['亂碼 U+FFFD'].push([rel, all.slice(Math.max(0, m.index - 30), m.index + 31).trim()]);
  }

  for (const m of prose.matchAll(/\*\*([^*\n]+)\*\*/g)) {
    // ASCII 括號或等號 = 行內程式碼寫在標題文字裡（`model(**inputs)`），不是漏渲染
    if (/[()=;{}]/.test(m[1])) continue;
    findings['裸露的 **粗體**（CommonMark 在中文標點旁不認粗體，把 ** 移到引號內側）'].push([rel, m[0]]);
  }

  // 只抓「原本是 --flag 被排版轉換吃成 —flag」的情況:真正的 flag 前面是空白或
  // 行首(` --tui` → ` —tui`),破折號前不會是字母。英文散文的破折號則是接在字母
  // 後面(`ago—so`、`key—your`),那是正常的 em-dash,不該誤報成 CLI 參數。
  for (const m of html.matchAll(/(?<![A-Za-z0-9])[—–]([A-Za-z][\w-]*)/g)) {
    findings['被排版轉換吃掉的 CLI 參數（應為 --flag）'].push([rel, m[0]]);
  }

  // 腳註引用格式是 `標題：URL (存取日期)`。URL 與括號緊貼時，GFM 的自動連結會把
  // `(` 或 `（` 連同日期一起吃進 href，連結直接壞掉。2026-07-30 量到 86 條腳註
  // 外部連結裡有 44 條是這樣壞的，而且 build、狀態碼、站內連結檢查全都看不到。
  //
  // 只掃腳註區：頁尾「回報錯誤」的 GitHub issue 連結會把含全形括號的標題編碼進
  // query string，%EF%BC%88 是正常的，全站掃會誤報 94 頁（第一版實測踩到）。
  const footnotes = html.match(/<section[^>]*data-footnotes[\s\S]*?<\/section>/);
  if (footnotes) {
    for (const m of footnotes[0].matchAll(/<a href="(https?:\/\/[^"]+)"/g)) {
      const href = m[1];
      if (/\(|%EF%BC%88|\d{4}-\d\d-\d\d$/.test(href)) {
        findings['腳註網址把括號與日期吃進去了（URL 與括號之間要留半形空白）'].push([rel, href]);
      }
    }
  }
}

let bad = false;
for (const [label, hits] of Object.entries(findings)) {
  if (hits.length === 0) continue;
  bad = true;
  const pages = new Set(hits.map(([rel]) => rel));
  console.log(`✗ ${label}：${pages.size} 頁 / ${hits.length} 處`);
  for (const [rel, sample] of hits.slice(0, 8)) {
    console.log(`    ${rel}  …${sample}…`);
  }
  if (hits.length > 8) console.log(`    …另外 ${hits.length - 8} 處`);
}

if (bad) {
  console.log('');
  console.log('內容型違規 MUST 改 knowledge/ 的原始 .md，NEVER 在 renderer 或元件加字元替換。');
  process.exit(1);
}

console.log(`✅ 可見文字字元檢查通過（掃 ${files.length} 頁）`);
