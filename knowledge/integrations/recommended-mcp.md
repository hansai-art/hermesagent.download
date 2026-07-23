---
title: "值得優先接的 MCP Server"
description: "MCP 讓 agent 接上外部工具,但每接一個就是多一份權限。這篇按「效益 vs 風險」排序,並說明各自的信任層級。"
date: 2026-07-23
subcategory: "mcp"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://modelcontextprotocol.io"
tags:
  - "mcp"
  - "integrations"
status: "published"
---

MCP(Model Context Protocol)是讓 agent 接上外部工具的標準介面。Hermes 可以連接任何 MCP server[^1],等於能力可以無限擴充。

但有一件事值得先想清楚:**每接一個 MCP,就是把一部分權限交出去**。檔案系統 MCP 能讀寫你的檔案,GitHub MCP 能操作你的 repo。這不是嚇你,而是說——接之前值得知道自己在授權什麼。

所以下面按「效益 vs 風險」排序,不是按熱門程度。

## 先接這幾個

### Filesystem MCP

`@modelcontextprotocol/server-filesystem`

讓 agent 讀寫**你指定的目錄**。這通常是第一個該接的,因為多數實用工作都需要它——讀專案原始碼、寫檔案、整理資料。

**風險控制的關鍵**:它只能存取你在設定裡明確指定的目錄。**不要圖方便指到家目錄根層**,指到具體的專案資料夾就好。

- 信任層級:可信第三方(MCP 官方參考實作)
- 風險:中等——取決於你開放哪些目錄

### Git MCP

`mcp-server-git`

對指定的 repo 做 git 操作,用 `uvx` 啟動,不需另外安裝。

比起 GitHub MCP,這個只碰本機 repo、不碰遠端帳號,風險小得多。**如果你只是想讓 agent 幫忙看 diff、寫 commit,這個就夠了。**

- 信任層級:可信第三方
- 風險:中等——會動到本機 git 歷史

### GitHub MCP

`@modelcontextprotocol/server-github`

查 issue、搜 code、操作 repo。

**這個要謹慎**:它用你的 GitHub token,權限範圍就是那把 token 的範圍。建議另外開一把**權限最小化的 token**,不要用你日常那把什麼都能做的。

- 信任層級:可信第三方
- 風險:中高——牽涉遠端帳號權限

## 特殊用途

### Chrome DevTools MCP

`chrome-devtools-mcp`

讓 agent 控制瀏覽器。對 **WSL2 使用者特別重要**——從 WSL2 直接控制 Windows 上的 Chrome 不會順利,官方建議就是走這個 MCP bridge。詳見 [WSL2 教學](/install/wsl2/)。

### 其他

Linear MCP(專案管理)、n8n MCP(自動化流程)等,適合已經在用那些工具的人。

## 接 MCP 之前該問的三個問題

**一、這個 server 是誰寫的?** MCP 官方參考實作(`@modelcontextprotocol/*`)相對可信;來源不明的第三方 server 等於讓陌生程式碼在你的環境裡跑。

**二、它需要什麼權限?** 檔案路徑、API token、網路存取——接之前先弄清楚。

**三、能不能給更小的權限?** 專用 token 而非萬用 token、特定目錄而非家目錄、唯讀而非讀寫。

## 這一塊還很缺內容

> 📝 **待補**:上面每個 MCP 的**實際設定步驟**(config 怎麼寫、怎麼確認接上了、常見錯誤)
> 我們目前都沒有。這也是 `integrations/` 分類文章不足三篇的原因。
>
> 你接過哪一個?[寫一篇或講給我們聽](https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml)——
> 一篇完整的設定教學,會直接改變這個分類的樣貌。

## 下一步

- 看官方內建能力 → [技能全目錄](/skills/catalog/)
- WSL2 接瀏覽器 → [WSL2 完整教學](/install/wsl2/)
- 想貢獻一篇 MCP 設定教學 → [貢獻指南](/contribute/)

[^1]: Nous Research, Docs — https://hermes-agent.nousresearch.com/docs(2026-07-23 存取)
