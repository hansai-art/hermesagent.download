# CITATION-SYSTEM.md — 腳註優先的引用系統

> 移植 taiwan-md 的 footnote-first 架構:內文用 Markdown `[^n]` 腳註,
> frontmatter 用 `upstream_refs` 收官方來源。

## 兩層引用

1. **`upstream_refs`(frontmatter)** — 這篇文章整體對應的官方文件 / repo 位置 / issue。
   文章頁尾會自動渲染成「官方來源」區塊。至少一筆。
2. **`[^n]` 腳註(內文)** — 具體宣稱的逐點引用:

```markdown
Hermes Agent 自 v1.4 起支援 Telegram 整合[^1]。

[^1]: Nous Research, Release v1.4.0 — https://github.com/...(2026-05-12)
```

## 什麼需要腳註

- 版本相關的宣稱(「自 vX.Y 起」「vX.Y 已移除」)
- 效能、限制、相容性數字
- 引述官方說法或 issue 中維護者的回覆
- 非官方但社群公認的 workaround(標明出處,註明「非官方」)

## 什麼不需要

- 照著做就能自行驗證的操作步驟
- 通用常識(什麼是環境變數)

## 密度基準

技術教學:每 400 字至少 1 個腳註或對應的 upstream_ref。
concepts/ 概念文:每 300 字至少 1 個(比照 taiwan-md 標準,概念文更容易憑印象亂寫)。

## 格式

`[^n]: 來源名稱, 標題 — URL(存取日期)`

失效連結由 pipeline 定期掃描(Phase 3);發現失效先找替代來源,找不到就把宣稱降級或移除。
