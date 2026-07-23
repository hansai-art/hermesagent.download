---
title: "Case 15：沒有直接給精準指令，先講太多背景"
description: "症狀：使用者只要命令，AI 卻先講一大段原理 真正過錯：輸出粒度不對 根因分類：輸出層 修補方式：先給可複製指令，再補背景 驗證方式：使用者能直接執行提供的命令 應提煉成的規則：當使用者明確要 SOP / 指令時，先給最短可執行答案"
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

- 症狀：使用者只要命令，AI 卻先講一大段原理
- 真正過錯：輸出粒度不對
- 根因分類：輸出層
- 修補方式：先給可複製指令，再補背景
- 驗證方式：使用者能直接執行提供的命令
- 應提煉成的規則：當使用者明確要 SOP / 指令時，先給最短可執行答案

- 分層:母題 2 · 輸出
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
