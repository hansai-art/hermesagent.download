---
title: "長 session 與 MCP 太肥導致越用越慢（school-08）"
description: "用一陣子後 agent 反應變慢,甚至卡住。"
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

用一陣子後 agent 反應變慢,甚至卡住。

## 診斷

問題出在效能膨脹這一層:長 session、壓縮、renderer 與掛太多 MCP 都會累積負擔。

## 解法

適時重開 session,精簡掛載的 MCP 數量,移除用不到的工具。

## 預防

只掛當前任務需要的 MCP,定期檢視效能,長任務分段重置。

- 分層:母題 8 · 效能
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
