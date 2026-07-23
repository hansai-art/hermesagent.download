import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 文章 frontmatter schema — knowledge/ 內所有 .md 都要通過這份驗證。
// 三個技術站專屬欄位是「自動進化」機制的施力點:
//   hermes_version — 適用版本範圍(上游改版時 UPSTREAM-WATCH pipeline 據此標過期)
//   last_verified  — 最後人工驗證日期(FRESHNESS pipeline 據此掃過期文章)
//   upstream_refs  — 對應的官方文件/issue(技術宣稱要能對到來源)
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  subcategory: z.string().optional().default(''),
  author: z.string().optional().default('HermesAgent.download Contributors'),
  hermes_version: z.string().optional().default('*'),
  last_verified: z.coerce.date().optional(),
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

export const collections = {
  'zh-TW': zhTW,
};

export type Article = z.infer<typeof articleSchema>;
