import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 文章 frontmatter schema - knowledge/ 內所有 .md 都要通過這份驗證。
// 三個技術站專屬欄位是「自動進化」機制的施力點：
//   hermes_version：適用版本範圍(上游改版時 UPSTREAM-WATCH pipeline 據此標過期)
//   last_verified：最後人工驗證日期(FRESHNESS pipeline 據此掃過期文章)
//   upstream_refs：對應的官方文件/issue(技術宣稱要能對到來源)
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  subcategory: z.string().optional().default(''),
  author: z.string().optional().default('HermesAgent.download Contributors'),
  hermes_version: z.string().optional().default('*'),
  last_verified: z.coerce.date().optional(),
  // 有沒有真人讀過並認可內容(不是「有沒有跑過指令」：那是 last_verified)。
  // 自動搬遷、AI 起草的文章預設是 false；唯有人工審閱後才能設 true。
  // 這個欄位存在的意義是誠實：讓讀者分得出哪些內容有人背書。
  human_reviewed: z.boolean().optional().default(false),
  // 是否對搜尋引擎隱藏索引(noindex)。未設時,issues/(上游薄鏡像)預設 noindex,
  // 其餘預設索引。個別文章可覆寫:升級成 canonical 解法後設 false 即可重新索引。
  noindex: z.boolean().optional(),
  // 跨語言配對鍵。中英兩版 slug 不同時(例:zh 用中文 slug「記憶系統」、
  // en 用「memory-system」),兩邊填同一個 translationKey 就能配成語言對(hreflang)。
  // 未填時退回用檔案 id 配對(pilot 頁中英 slug 相同,不需填)。
  translationKey: z.string().optional(),
  upstream_refs: z.array(z.string().url()).optional().default([]),
  sources: z.array(z.string()).optional().default([]),
  status: z
    .enum(['draft', 'published', 'outdated', 'archived'])
    .optional()
    .default('published'),
  featured: z.boolean().optional().default(false),
});

// 每個語言一個 collection(比照 taiwan-md);src/content/ 由 sync 從 knowledge/ 投影而來
const zhTW = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zh-TW' }),
  schema: articleSchema,
});

// 英文軸:內容來源 knowledge/en/,由 sync 投影到 src/content/en/。
const en = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/en' }),
  schema: articleSchema,
});

export const collections = {
  'zh-TW': zhTW,
  en,
};

export type Article = z.infer<typeof articleSchema>;
