---
title: "擴充功能"
description: "擴充功能"
date: 2026-07-23
subcategory: "overview"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
tags:
  - "overview"
status: "published"
---

## 精選 Skills

[

### plan

官方內建的計畫模式：先把任務拆成可執行的 markdown 計畫再動手，是新手建立正確工作流的第一個 skill。

→](/skills/recommended-skills/)[

### systematic-debugging

官方內建的四階段根因除錯法：先理解 bug 再修，避免亂猜 patch。

→](/skills/recommended-skills/)[

### github-pr-workflow

官方內建的 GitHub PR 完整流程：開分支、commit、開 PR、看 CI、merge，一條龍。

→](/skills/recommended-skills/)

## 精選 MCP

[

### Filesystem MCP (@modelcontextprotocol/server-filesystem)

官方教學的第一個示範 MCP：讓 Hermes 讀寫指定目錄的檔案，最容易上手。

→](/integrations/recommended-mcp/)[

### GitHub MCP (@modelcontextprotocol/server-github)

官方教學示範的 GitHub MCP：查 issue、搜 code、操作 repo。

→](/integrations/recommended-mcp/)[

### Git MCP (mcp-server-git)

官方教學示範的 Git MCP：對指定 repo 做 git 操作，用 uvx 啟動。

→](/integrations/recommended-mcp/)

## 安裝順序建議

1

#### 1\. 先讓核心執行流程穩定

先確保 Hermes 本體、模型 API、工作目錄都穩，再加擴充。

2

#### 2\. 每次只新增一個能力層

一次裝一個 Skill 或一組 MCP，這樣出錯時才知道是哪一層造成。

3

#### 3\. 先解決你最常做的任務

如果你每天都在查資料，就先補搜尋；如果你每天都在改 code，就先補檔案系統、Git 與瀏覽器。
