---
title: "新手路線:從零到跑起來"
description: "四個步驟、大約三十分鐘。每一步都告訴你怎麼確認做對了,以及卡住時該看哪一篇。"
date: 2026-07-23
subcategory: "onboarding"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "onboarding"
  - "guides"
status: "published"
---

第一次裝 AI agent 最容易卡住的地方,不是某個步驟太難,而是**不知道自己現在在哪一步、下一步該做什麼**。裝完了嗎?為什麼打指令沒反應?要先設模型還是先接平台?

這頁把整條路線攤開:四個步驟,大約三十分鐘,每一步都有明確的完成判準。

## 全貌

```
1. 安裝          →  2. 設定模型      →  3. 第一次對話    →  4. 接進工作流
   (10 分鐘)         (5 分鐘)           (2 分鐘)          (依需求)
   裝好執行檔        告訴它用哪個 LLM    確認整條路通了     Telegram / skills / MCP
```

**重點**:第 1 步和第 2 步是分開的。很多人裝完就打 `hermes`,發現沒反應以為安裝失敗——其實只是還沒告訴它要用哪個模型。

## 步驟一:安裝(約 10 分鐘)

選你的作業系統:

- [macOS](/install/macos/) — 桌面版或一行指令
- [Windows](/install/windows/) — 桌面版 / PowerShell / WSL2 三選一
- [Linux](/install/linux/) — 一行指令,但要先裝 `curl` 和 `xz-utils`
- [WSL2 完整路線](/install/wsl2/) — 想要完整 Linux 工具鏈的 Windows 使用者

**完成判準**:

```bash
hermes doctor
```

有輸出、沒有大量紅色錯誤,就代表執行檔裝好了。

**卡住了?** 打 `hermes` 說 command not found 是最常見的狀況,而且**九成不是安裝失敗**——見 [command not found 怎麼解](/troubleshoot/command-not-found/)。

## 步驟二:設定模型(約 5 分鐘)

Hermes 不自帶模型,你得告訴它去哪裡取得推論能力。最快的方式:

```bash
hermes model
```

互動式選單,選供應商並填 API key[^1]。

**不想一家家申請 key?** 用官方 Portal 一次搞定:

```bash
hermes setup --portal
```

**完全不想花錢?** 選 Custom endpoint 接本地的 Ollama。

三種方式的差別、各家供應商怎麼選、以及**怎麼讓子代理跑便宜模型省錢**,見 [模型供應商與 API key 設定](/config/model-provider/)。

**完成判準**:

```bash
hermes config show
```

看得到你剛設的供應商與模型。

**卡住了?** key 明明是對的卻報錯,九成是 key 跟供應商配錯了——見 [API key not set 怎麼解](/troubleshoot/api-key-not-set/)。

## 步驟三:第一次對話(2 分鐘)

```bash
hermes
```

隨便問一句話,例如「你能做什麼?」

**完成判準**:它正常回覆了。到這裡整條路就通了——安裝、模型、對話三段都沒問題。

建議第一次對話多花五分鐘做這件事:**告訴它你是誰、你在做什麼專案、你的偏好**。Hermes 的記憶系統會跨對話保留這些,講一次之後就不用再重複。

## 步驟四:接進你的工作流

到這裡基本功能都能用了。接下來看你想做什麼:

**想在手機上用** → 接 Telegram。可以隨時丟一句話給它,它在遠端做完再回報。
先看 [Telegram 常見坑](/troubleshoot/telegram/),那兩個坑會省下你不少時間。

**想擴充能力** → 看 [官方 skills 全目錄](/skills/catalog/),173 個內建與選配技能。

**想接外部工具** → 看 [推薦的 MCP server](/integrations/recommended-mcp/),檔案系統、GitHub、瀏覽器都能接。

**從 OpenClaw 搬過來** → [遷移指南](/migrate/migrate-from-openclaw/),記憶和 skills 大部分能直接搬。

## 常見卡關點速查

| 症狀 | 多半是 | 看這篇 |
|---|---|---|
| `command not found` | shell 沒重載 PATH | [解法](/troubleshoot/command-not-found/) |
| `API key not set` | key 跟供應商配錯 | [解法](/troubleshoot/api-key-not-set/) |
| `Python 3.11 or newer` | 沒走官方安裝腳本 | [解法](/troubleshoot/python-version-too-old/) |
| `context length exceeded` | 對話太長,或本地模型 context 設定沒對 | [解法](/troubleshoot/context-length-exceeded/) |
| Telegram 指令選單少東西 | 超過平台 100 個指令上限 | [解法](/troubleshoot/telegram/) |

## 下一步

- 想先搞懂它到底是什麼 → [什麼是 Hermes Agent](/concepts/什麼是-hermes-agent/)
- 遇到其他問題 → [疑難排解總覽](/troubleshoot/overview/)
- 想看別人怎麼用 → [官方 issue 中文精選](/issues/)

[^1]: Nous Research, Installation — https://hermes-agent.nousresearch.com/docs/getting-started/installation(2026-07-23 存取)
