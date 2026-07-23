---
title: "新手教學"
description: "新手教學"
date: 2026-07-23
subcategory: "onboarding"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
tags:
  - "onboarding"
status: "published"
---

## 起步教學（本站整理）

[

### Hermes Agent 模型供應商與 API key 設定教學

hermes model 指令完整教學：OpenRouter / OpenAI / Anthropic / Gemini / Ollama 本地模型設定、API key 錯誤排解、省錢技巧。

→](/config/model-provider/)[

### OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）

用官方內建的 hermes claw migrate 把 OpenClaw 的記憶、SOUL.md、skills 與設定搬進 Hermes Agent：dry-run 預覽、模式選擇、搬不動的東西。

→](/migrate/migrate-from-openclaw/)

## 第一次啟動 Hermes Agent

1

#### 1\. 用官方指令啟動

先照官方文件完成安裝，重新載入 shell 後在終端機輸入 `hermes` 進入對話介面；第一次啟動用 `hermes model` 選模型供應商並填 API key。

2

#### 2\. 先做最小驗證

建立一個簡單任務，例如要求它讀取當前目錄、回答一個問題，或連到指定網站，確認模型、工具與網路權限都正常。

3

#### 3\. 再接 Skills 與 MCP

不要一開始就把所有外掛接滿。先從檔案系統、瀏覽器、自動搜尋等高頻能力開始，問題比較容易定位。

4

#### 4\. 出錯就回排錯頁

如果遇到 401、MCP timeout、找不到指令等情況，直接回常見問題排解或官方 Issue 摘要對照。

## 下一步建議

[

### 下載安裝

回到官方下載入口，確認你走的是正確安裝路徑。

→](/install/download/)[

### 進階安裝

想把 Hermes 放到 Docker、雲端或 serverless，就從這裡接續。

→](/install/advanced/)[

### Skills 與 MCP

開始挑選最值得先裝的擴充能力。

→](/skills/skills-mcp-overview/)[

### 常見問題排解

遇到錯誤時先看這裡，省掉大量試錯。

→](/troubleshoot/overview/)
