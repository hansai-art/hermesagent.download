---
title: "新手先接哪些 MCP?一份挑選清單"
description: "MCP 是幫 agent 外接工具的插頭。但每接一個,就等於多交出一份權限。這篇幫你照「好處 vs 風險」排好順序,先接哪個、要小心哪個,一次講清楚。"
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

先講兩個名詞,後面會一直用到。

**agent(智慧助手)**:就是會幫你做事的 AI 程式。你交代它,它去執行。

**MCP(全名 Model Context Protocol,一種讓 agent 外接工具的共通接法)**:你可以把它想成一個「標準插頭」。有了它,agent 就能接上外面各式各樣的工具。Hermes 可以接上任何一個 MCP[^1],所以它的本事幾乎可以無限往外長。

聽起來很棒。但有一件事,建議你動手接之前先想清楚。

**每接一個 MCP,就等於把一部分權限交出去。** 舉例:接了「檔案 MCP」,agent 就能讀、能改你的檔案;接了「GitHub MCP」,agent 就能動你在 GitHub 上的專案。這不是要嚇你,只是提醒你:接之前,先知道自己正在把什麼交出去。

所以下面這份清單,不是照「哪個最紅」排,而是照「好處大不大、風險高不高」排。

## 這幾個,建議先接

### 檔案 MCP(Filesystem MCP)

`@modelcontextprotocol/server-filesystem`

它讓 agent 讀寫**你指定的資料夾**。這通常是第一個該接的,因為大部分實用的工作都會用到它:讀你的專案程式碼、幫你存檔、幫你整理資料。

**控制風險的重點就一句話**:它只能碰你在設定裡「明講出來」的資料夾。**不要為了省事,直接指到你的家目錄最上層**(家目錄就是你電腦裡屬於你的那一大包資料的總入口)。指到一個具體的專案資料夾就好,範圍越小越安心。

- 這是誰做的:可信的第三方(這是 MCP 官方自己出的示範版本)
- 風險高低:中等。你開放的資料夾越大,風險越高

### Git MCP

`mcp-server-git`

它幫你對指定的專案做 git 操作(git 是一套幫你記錄程式碼每次改動的工具,像是「存檔紀錄本」)。它用 `uvx` 這個指令直接啟動,不用你先另外安裝。

跟下面的 GitHub MCP 比,這個安全很多:它只動你**自己電腦裡**的專案,不會碰到你網路上的帳號。**如果你只是想讓 agent 幫你看看「這次改了哪些地方」(也就是 diff),或幫你寫一筆改動紀錄(也就是 commit),接這個就夠了。**

- 這是誰做的:可信的第三方
- 風險高低:中等。它會動到你電腦裡的 git 存檔紀錄

### GitHub MCP

`@modelcontextprotocol/server-github`

它能幫你查問題單(issue)、搜程式碼、操作你在 GitHub 上的專案。

**這個要特別小心。** 它會用你的 GitHub token 來動作(token 就是一把「數位鑰匙」,拿著它就能代表你做事)。這把鑰匙能開多少門,agent 就能做多少事。所以建議你:另外去申請一把**權限盡量小**的鑰匙給它用,不要把你平常那把「什麼都能開」的萬用鑰匙交出去。

- 這是誰做的:可信的第三方
- 風險高低:中偏高。因為它碰的是你網路帳號的權限

## 有特殊需求才接

### Chrome DevTools MCP

`chrome-devtools-mcp`

它讓 agent 去操控你的瀏覽器。

對 **WSL2 的使用者特別有用**(WSL2 是一種讓你在 Windows 裡面跑 Linux 的環境)。如果你想從 WSL2 裡直接去控制 Windows 上的 Chrome,通常會不順;官方建議的做法,就是靠這個 MCP 當「橋樑」來連過去。詳細做法看 [WSL2 教學](/install/wsl2/)。

### 其他

還有像 Linear MCP(幫你管專案進度)、n8n MCP(幫你把一連串動作自動串起來)等等。這些適合「本來就在用這些工具」的人,如果你沒在用,先跳過沒關係。

## 接任何一個 MCP 之前,先問自己三個問題

**問題一:這個 MCP 是誰做的?** 如果名字開頭是 `@modelcontextprotocol/*`,那是 MCP 官方自己出的,相對放心。如果是來路不明的人做的,等於是讓一段你不認識的程式碼,在你的電腦裡跑,要更謹慎。

**問題二:它要跟我拿什麼權限?** 是要碰哪些資料夾?要不要 API token(一把代表你的數位鑰匙)?要不要連網路?接之前先弄清楚。

**問題三:能不能只給它更小的權限?** 能給專用鑰匙,就別給萬用鑰匙;能只開一個資料夾,就別開整個家目錄;能只給「唯讀」(只能看不能改),就別給「可讀可寫」。

## 老實說,這一塊還很缺內容

> 📝 **還沒寫的部分**:上面每個 MCP 的**實際設定步驟**，設定檔到底怎麼填、接好之後怎麼確認真的接上了、常見的錯誤長什麼樣。這些我們目前都還沒有。這也是為什麼 `integrations/` 這個分類的文章還不到三篇。
>
> 你接過上面哪一個嗎?[寫一篇分享,或直接跟我們說](https://github.com/hansai-art/hermesagent.download/issues/new?template=02-article-proposal.yml):
> 一篇完整的設定教學,就能讓這個分類整個不一樣。

## 接下來可以看

- 想知道 Hermes 內建就有哪些本事 → [技能全目錄](/skills/catalog/)
- 想從 WSL2 接上瀏覽器 → [WSL2 完整教學](/install/wsl2/)
- 想幫忙寫一篇 MCP 設定教學 → [貢獻指南](/contribute/)

[^1]: Nous Research, Docs:https://hermes-agent.nousresearch.com/docs (2026-07-23 存取)
