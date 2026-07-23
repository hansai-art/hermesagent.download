---
title: "推薦 MCP"
description: "推薦 MCP"
date: 2026-07-23
subcategory: "mcp"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
tags:
  - "mcp"
status: "published"
---

## 優先研究的 MCP Server

[

### Filesystem MCP (@modelcontextprotocol/server-filesystem)

官方教學的第一個示範 MCP：讓 Hermes 讀寫指定目錄的檔案，最容易上手。 信任層級：可信第三方。風險：medium。

→](/community/resources/)[

### GitHub MCP (@modelcontextprotocol/server-github)

官方教學示範的 GitHub MCP：查 issue、搜 code、操作 repo。 信任層級：可信第三方。風險：medium。

→](/community/resources/)[

### Git MCP (mcp-server-git)

官方教學示範的 Git MCP：對指定 repo 做 git 操作，用 uvx 啟動。 信任層級：可信第三方。風險：medium。

→](/community/resources/)[

### Chrome DevTools MCP (chrome-devtools-mcp)

官方教學示範的瀏覽器自動化 MCP：控制 Chrome 分頁做網頁操作，WSL 也有對應橋接做法。 信任層級：可信第三方。風險：high。

→](/community/resources/)[

### Linear MCP

官方核准 catalog（optional-mcps）收錄：查詢、建立、更新 Linear 的 issue 與專案，原生 OAuth 免本機安裝。 信任層級：官方。風險：medium。

→](/community/resources/)[

### n8n MCP

官方核准 catalog（optional-mcps）收錄：從 Hermes 管理與檢視 n8n 工作流（stdio 橋接，不開公開埠）。 信任層級：官方。風險：medium。

→](/community/resources/)[

### Unreal Engine MCP

官方核准 catalog（optional-mcps）收錄：連 Unreal Engine 5.8 編輯器內建的本機 MCP server，遊戲開發者專用。 信任層級：官方。風險：medium。

→](/community/resources/)

## 接 MCP 前先想清楚

1

#### 1\. 每個 MCP 都是權限邊界

能碰 GitHub、Docker、資料庫的 MCP，都等於把那個系統開一扇門給 Agent，用前先定義權限範圍。

2

#### 2\. 先接讀取型，再接寫入型

搜尋、知識庫、觀測類 MCP 比較容易驗證；會改資料、發 PR、操控容器的，建議第二階段再接。

3

#### 3\. 留下每個 MCP 的配置筆記

一旦出現 timeout、認證錯誤或 schema mismatch，你會很需要一份清楚的安裝與憑證紀錄。
