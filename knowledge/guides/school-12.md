---
title: "Case 11：首頁圖片更新被過度推論"
description: "症狀：featured image 更新後就說首頁圖片已更新 真正過錯：把部分成功誤報成完整成功 根因分類：輸出層 修補方式：改為明確說明「文章精選圖已更新，但首頁 hero 未驗證」 驗證方式：檢查前台版位實際是否有顯示該圖 應提煉成的規則：前台版位未驗到，就不能宣稱整體已完成"
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

- 症狀：featured image 更新後就說首頁圖片已更新
- 真正過錯：把部分成功誤報成完整成功
- 根因分類：輸出層
- 修補方式：改為明確說明「文章精選圖已更新，但首頁 hero 未驗證」
- 驗證方式：檢查前台版位實際是否有顯示該圖
- 應提煉成的規則：前台版位未驗到，就不能宣稱整體已完成

- 分層:母題 2 · 輸出
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
