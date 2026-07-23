---
title: "改完 tool / plugin / config 不知道要不要 reset（school-04）"
description: "改了設定或裝了新工具,但 agent 行為沒變,像是改動沒生效。"
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

改了設定或裝了新工具,但 agent 行為沒變,像是改動沒生效。

## 診斷

問題出在工具生效時機這一層。很多設定與 MCP 變更要重置 session 才會重新載入,不 reset 就會用到舊狀態。

## 解法

改完工具或設定後主動重置 session,確認新設定被重新讀取再繼續任務。

## 預防

建立習慣:任何 config / MCP / plugin 變更後,預設先 reset 再驗證。

- 分層:母題 4 · 工具
- 資訊來源信任度:可信
- 原始教材:[hermes-agent-school](https://github.com/hansai-art/hermes-agent-school/blob/main/cases/30-error-cards.md)
