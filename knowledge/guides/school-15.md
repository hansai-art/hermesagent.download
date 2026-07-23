---
title: "Case 14：Cloudflare 擋住 ChatGPT 網頁 fallback"
description: "症狀：想用網頁生圖 fallback，但卡在人機驗證 真正過錯：選了一條不穩定的備援路徑 根因分類：工具層 修補方式：回到 Hermes plugin / OAuth 正規路徑 驗證方式：plugin + auth + new session 後，功能可用 應提煉成的規則：fallback 不能只看理論，還要看現場阻擋"
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

- 症狀：想用網頁生圖 fallback，但卡在人機驗證
- 真正過錯：選了一條不穩定的備援路徑
- 根因分類：工具層
- 修補方式：回到 Hermes plugin / OAuth 正規路徑
- 驗證方式：plugin + auth + new session 後，功能可用
- 應提煉成的規則：fallback 不能只看理論，還要看現場阻擋條件

- 分層:母題 2 · 工具
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
