# HermesAgent.download

> **你花三小時才解開的錯誤,下一個人只要三分鐘。**
>
> Hermes Agent 中文社群知識庫 — 共筆、開源、自動進化。
> 非官方站,與 Nous Research 無關;所有下載連結一律導向官方來源。

安裝一個 AI agent 卡住的時候,中文世界能查到的資料常常是零星的、過期的、
或是根本沒有人寫過。這個站想解決的就是這件事:把散落在 issue、Discord、
個人筆記裡的解法收攏成一個所有人都能編輯、而且**會自己偵測過期**的知識庫。

[🌐 網站](https://hermesagent.download) ·
[✋ 我想貢獻](https://hermesagent.download/contribute/) ·
[📊 儀表板](https://hermesagent.download/dashboard/) ·
[📡 開放資料 API](https://hermesagent.download/api/index.json)

架構取法 [taiwan-md](https://github.com/frank890417/taiwan-md) 🙏。

<!-- STATS:START — 由 scripts/tools/generate-stats.mjs 自動產生(SSOT: knowledge/ + data/*.json)。請勿手動編輯。 -->

| 指標 | 數字 |
|---|---|
| 📄 文章總數 | 353 |
| ✅ 已發布 | 352 |
| 🔗 有官方來源 | 100% |
| 🔍 近期實測驗證 | 39 |
| 👥 貢獻者 | 1 |
| ⭐ GitHub Stars | 0 |
| 🔨 近 30 天更新 | 23 |

<sub>每日自動更新.最後更新 2026-07-24.原始資料:[/api/stats.json](https://hermesagent.download/api/stats.json)</sub>

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
