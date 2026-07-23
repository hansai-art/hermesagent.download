---
title: "Case 08：表格使用裸 HTML 而非 Gutenberg block"
description: "症狀：WordPress 顯示可用，但格式不符合編輯器規範 真正過錯：只追求「看起來有表格」，沒對齊 CMS 真實格式 根因分類：輸出層 修補方式：改成 wp:table 結構 驗證方式：文章原始內容可見 block 標記，前台正常顯示 應提煉成的規則：CMS 任務要符合系統語法，不只是 HTML 可渲染"
date: 2026-07-15
subcategory: "school"
hermes_version: "*"
last_verified: 2026-07-15
upstream_refs:
  - "https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md"
tags:
  - "school"
  - "error-cards"
status: "published"
---

## 症狀

- 症狀：WordPress 顯示可用，但格式不符合編輯器規範
- 真正過錯：只追求「看起來有表格」，沒對齊 CMS 真實格式
- 根因分類：輸出層
- 修補方式：改成 `wp:table` 結構
- 驗證方式：文章原始內容可見 block 標記，前台正常顯示
- 應提煉成的規則：CMS 任務要符合系統語法，不只是 HTML 可渲染

- 分層:母題 2 · 輸出
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
