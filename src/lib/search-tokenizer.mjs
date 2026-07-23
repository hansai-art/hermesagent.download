// 中英混合分詞器 — 建索引與查詢時必須用同一份,否則搜不到。
//
// 為什麼需要自訂:minisearch 預設用空白/標點切詞,對中文完全無效
// (「安裝教學」會變成一整個詞,搜「安裝」搜不到)。
// 解法:CJK 片段切成 bigram(雙字)+ unigram(單字),英數維持一般切詞。
// 「模型設定」→ ["模型", "型設", "設定", "模", "型", "設", "定"]

const CJK = /[㐀-䶿一-鿿豈-﫿぀-ヿ]/;

export function tokenize(text) {
  if (!text) return [];
  const tokens = [];
  // 先用非字元邊界切開,拿到「詞塊」
  for (const chunk of String(text).split(/[^\p{L}\p{N}_.-]+/u)) {
    if (!chunk) continue;
    if (!CJK.test(chunk)) {
      // 純英數:整塊當一個 token(hermes-agent、v1.4、OPENROUTER_API_KEY)
      tokens.push(chunk);
      // 再依連字號/底線/點拆一次,讓 "api" 也搜得到 "OPENROUTER_API_KEY"
      for (const part of chunk.split(/[-_.]+/)) {
        if (part && part !== chunk) tokens.push(part);
      }
      continue;
    }
    // 含 CJK:逐段處理
    let buf = '';
    const flushLatin = () => {
      if (buf) {
        tokens.push(buf);
        buf = '';
      }
    };
    const chars = [...chunk];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (CJK.test(c)) {
        flushLatin();
        tokens.push(c); // unigram
        const next = chars[i + 1];
        if (next && CJK.test(next)) tokens.push(c + next); // bigram
      } else {
        buf += c;
      }
    }
    flushLatin();
  }
  return tokens;
}

export function processTerm(term) {
  return term.toLowerCase();
}

// minisearch 共用設定(建索引與前端查詢都 import 這份)
export const SEARCH_OPTIONS = {
  fields: ['title', 'description', 'body', 'tags', 'category'],
  storeFields: ['title', 'description', 'category', 'status', 'url'],
  tokenize,
  processTerm,
  searchOptions: {
    boost: { title: 4, description: 2, tags: 2 },
    fuzzy: 0.15,
    prefix: true,
  },
};
