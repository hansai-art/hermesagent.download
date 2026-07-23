---
title: "常見問題排解"
description: "Hermes Agent 安裝與執行常見錯誤的排解指南"
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

Hermes Agent · 中文入口

# 非官方中文下載、安裝與新手學習入口

整理官方下載、安裝教學、Skill / MCP 推薦、高手使用摘要與 GitHub Issue 精選問答,幫中文使用者從安裝到進階工作流一次上手。

Unofficial community guide Not affiliated with Nous Research

[前往官方下載](/install/download/) [從新手路線開始](/install/advanced/) [找 Skill / MCP](/skills/recommended-skills/)

## 逐題排解教學（本站整理）

[

### hermes: command not found 怎麼解？

hermes: command not found 幾乎都是 shell 還沒重新載入 PATH：執行 source ~/.bashrc 或 source ~/.zshrc，或直接開新終端機；安裝器會把 ~/.local/bin 加進 PATH。

→](/troubleshoot/command-not-found/)[

### API key not set / API key 無效怎麼解？

看到 API key not set 就跑 hermes model 重新設定供應商，或直接 hermes config set OPENROUTER\_API\_KEY your\_key；key 無效多半是填了不對應供應商的 key。

→](/troubleshoot/api-key-not-set/)[

### Hermes requires Python 3.11 or newer 怎麼解？

Hermes 需要 Python 3.11 以上：先 python3 --version 確認版本，太舊就用系統套件管理器升級；走官方安裝器的話 Python 3.11 會自動處理，通常不會遇到。

→](/troubleshoot/python-version-too-old/)[

### context length exceeded 怎麼解？

context length exceeded 的官方解法：先用 /compress 壓縮目前 session，用 /usage 看用量；長期解法是在 config.yaml 的 model.context\_length 明確設定模型實際上限。

→](/troubleshoot/context-length-exceeded/)[

### Telegram 接 Hermes Agent 常見坑與解法

Telegram 整合最常見兩個坑：Telegram 有 100 個斜線指令上限（用 skills.platform\_disabled 停用不需要的 skill），以及 WSL 下 gateway 斷線（改用 hermes gateway run 前景模式或 tmux）。

→](/troubleshoot/telegram/)

## 排錯的正確順序

1

#### 1\. 先跑官方診斷

\`hermes doctor\` 會做全面診斷，多數環境問題會直接指出原因。

2

#### 2\. 對照本站逐題排解

上面的排解教學覆蓋最常見錯誤：command not found、API key、Python 版本、context 上限、Telegram。

3

#### 3\. 查官方 Issue 精選

還是解不掉，就到本站的官方 Issue 精選問答依分類找同樣症狀，每筆都附官方連結與目前狀態。

## 更多疑難雜症

[

### 查看官方 Issues Q&A

我們整理了最多人詢問的 GitHub 官方 Issue 摘要。

→](/issues/)[

### 社群解法與筆記

看看社群整理的踩坑記錄與心得。

→](/guides/)
