// 從文章 Markdown 的「常見問題 / FAQ」區塊抽出問答對，產生 schema.org FAQPage。
// 目的：讓 AI 回答引擎能直接讀出 Q→A 結構，提高被引用機率(AEO)。
//
// 只掃描「## 常見問題」(或常見問答 / FAQ / Q&A)這一個 H2 區塊底下的 H3,
// 避免把「## 照這個順序解」底下的步驟(### 1. …)誤當成問答。

const FAQ_HEADING = /^##\s+(常見問題|常見問答|常見疑問|FAQ|Q\s*&\s*A)\s*$/im;

// 把一段 Markdown 清成給機器讀的純文字答案。
function toPlainText(md) {
  return md
    .replace(/\[\^[^\]]+\]/g, '') // 去腳註標記 [^1]
    .replace(/```[\s\S]*?```/g, ' ') // 去 code fence
    .replace(/`([^`]+)`/g, '$1') // 去行內 code 反引號
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 去圖片
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // 連結 [文字](url) → 文字
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 去粗體
    .replace(/\*([^*]+)\*/g, '$1') // 去斜體
    .replace(/^\s{0,3}>\s?/gm, '') // 去引用符號
    .replace(/^\s*[-*]\s+/gm, '') // 去清單符號
    .replace(/\|/g, ' ') // 表格分隔改空白
    .replace(/\s+/g, ' ') // 收斂空白
    .trim();
}

/**
 * @param {string} body 文章原始 Markdown
 * @returns {Array<{q: string, a: string}>} 問答對(不足 2 組回空陣列)
 */
export function extractFaq(body) {
  if (!body) return [];
  const lines = body.split('\n');

  // 找到「## 常見問題」的行號
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (FAQ_HEADING.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return [];

  // 該 H2 區塊到下一個 H2(## )或檔尾為止
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i]) && !/^###/.test(lines[i])) {
      end = i;
      break;
    }
  }

  const section = lines.slice(start, end);
  const pairs = [];
  let curQ = null;
  let buf = [];
  const flush = () => {
    if (curQ) {
      const a = toPlainText(buf.join('\n'));
      if (a) pairs.push({ q: curQ, a });
    }
    buf = [];
  };
  for (const line of section) {
    const h3 = line.match(/^###\s+(.*\S)\s*$/);
    if (h3) {
      flush();
      curQ = toPlainText(h3[1]);
    } else if (curQ) {
      buf.push(line);
    }
  }
  flush();

  return pairs.length >= 2 ? pairs : [];
}

/**
 * 產生 FAQPage JSON-LD；無足夠問答對回 null。
 * @param {string} body 文章原始 Markdown
 */
export function buildFaqSchema(body) {
  const pairs = extractFaq(body);
  if (!pairs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };
}
