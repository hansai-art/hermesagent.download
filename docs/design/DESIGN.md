# DESIGN.md — 黑色設計語言

> 沿用 hermesagent.download 既有的深色設計感。tokens 定義在 `src/styles/global.css` 的
> `:root`,改那裡即全站生效。本文件是規範與理由,不是第二份真相來源。

## Tokens(現值)

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#0a0a0c` | 頁面背景(近黑,帶一點藍紫避免死黑) |
| `--bg-raised` | `#121216` | 卡片、code block、浮起層 |
| `--border` | `#26262c` | 1px 細邊框,取代陰影 |
| `--text` | `#e8e8ea` | 主文字(不用純白,降低眩光) |
| `--text-dim` | `#9a9aa3` | 次要文字、meta 資訊 |
| `--accent` | `#d8a752` | Hermes 金——連結、CTA、強調 |
| `--accent-dim` | `#8a6c38` | hover 邊框、次要強調 |

> ⚠️ Phase 1 內容搬遷時,對照舊站實際色票微調上表(特別是 accent 色)。

## 原則

1. **深色是預設,不做淺色模式**(現階段)。技術讀者長時間閱讀,深色 + 低對比邊框最舒服。
2. **層次靠邊框不靠陰影**:`--border` 1px 邊框 + `--bg-raised` 底色區分層級。
3. **金色只用在可互動與強調**:連結、CTA、過期警示。大面積留給黑與灰。
4. **中文排版**:內文 `line-height: 1.85`,Noto Sans TC 優先;標點擠壓交給瀏覽器。
5. **code block 是一等公民**:必標語言、`github-dark` 主題、圓角 8px、可橫向捲動。

## 元件慣例

- 卡片:`--bg-raised` 底 + `--border` 框,hover 時邊框轉 `--accent-dim`
- 過期橫幅:`--accent` 文字 + `--accent-dim` 邊框(見 `[slug].astro`)
- 頁首:sticky + backdrop-blur,半透明黑
