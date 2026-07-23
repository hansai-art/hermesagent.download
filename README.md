# HermesAgent.download

> Hermes Agent 中文社群知識庫 — 共筆、開源、自動進化。
> 非官方站,與 Nous Research 無關;所有下載連結一律導向官方來源。

任何人都可以透過編輯這個 repo 來共同維護 [hermesagent.download](https://hermesagent.download)。
架構取法 [taiwan-md](https://github.com/frank890417/taiwan-md) 🙏。

<!-- STATS:START -->

**353** 篇文章.published 351.draft 1.outdated 0.archived 1(2026-07-23 更新)

<!-- STATS:END -->

## 架構總覽

```
knowledge/                 ← 唯一真相來源(SSOT):所有文章都在這,純 Markdown
    │
    │  node scripts/core/sync.mjs(npm install / dev / build 自動觸發)
    ▼
src/content/{lang}/        ← 投影層(自動產生,gitignore,不要手改)
    │
    │  astro build
    ▼
dist/                      ← 靜態網站 → hermesagent.download
```

- **內容**改 `knowledge/`,不用懂程式。
- **分類與語言**的真相來源在 `src/config/categories.mjs` 與 `src/config/languages.mjs`。
- **品質**由 `scripts/tools/article-health.mjs` 在每個 PR 自動把關。
- **編輯規範**在 `docs/editorial/`(寫作方法、檢查清單、引用系統、譯名表)。

## 12 個分類

🖥️ install 安裝部署.⚙️ config 模型與 API 設定.🧩 skills 技能目錄.
🔌 integrations 生態整合.📖 guides 使用教學.🚑 troubleshoot 疑難排解.
🔄 migrate 遷移指南.🐛 issues 精選 Issue.📰 releases 版本情報.
🧠 concepts 核心概念.👥 community 社群.ℹ️ about 關於

## 本地開發

```bash
npm install     # 會自動跑 sync
npm run dev     # http://localhost:4321
npm run build   # 產出 dist/
npm run article-health   # 文章健康掃描
```

需求:Node.js >= 22.12。

## 如何貢獻

1. **改一篇文章**:直接在 GitHub 上編輯 `knowledge/` 內的 .md,發 PR。
2. **寫一篇新文章**:讀 `docs/editorial/REWRITE-PIPELINE.md`,用 `CONTRIBUTE_PROMPT.md`
   讓你的 AI 幫你寫出符合規範的初稿。
3. 詳見 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 文章 frontmatter

```yaml
---
title: 在 WSL2 上安裝 Hermes Agent
description: 一句話說明這篇文章(會顯示在卡片與搜尋結果)
date: 2026-07-23
subcategory: windows
hermes_version: '>=1.4' # 適用版本範圍
last_verified: 2026-07-23 # 最後實測日期(教學類必填)
upstream_refs: # 對應官方來源,至少一筆
  - https://github.com/NousResearch/...
tags: [wsl2, windows]
status: published # draft / published / outdated / archived
---
```

`hermes_version` + `last_verified` + `upstream_refs` 是本站「自動進化」機制的施力點:
Phase 3 的 pipelines 會監看上游 release,自動標記過期文章並開 issue 引導更新。

## 授權

- 內容:[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant)
- 程式碼:MIT
