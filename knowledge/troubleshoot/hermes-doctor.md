---
title: "hermes doctor 到底檢查什麼：16 個區塊逐項解讀"
description: "附 macOS 實機輸出。教你分辨 ⚠ 是「壞掉」還是「你沒裝而已」，並提醒兩件官方沒講的事：離開代碼永遠是 0，以及 hermes status --all 在舊版會把 API 金鑰完整印出來。"
date: 2026-07-29
subcategory: "diagnostics"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://github.com/NousResearch/hermes-agent/pull/55576"
tags:
  - "troubleshoot"
  - "diagnostics"
status: "published"
---

裝好了，`hermes` 指令也有反應，但某個功能就是不動。這種時候最浪費時間的做法，是去搜尋錯誤訊息然後照網路上的解法亂試。

先跑這一支：

```bash
hermes doctor
```

本篇的所有輸出與行為都是在 **macOS、Hermes Agent v0.17.0、Python 3.11.14** 上實際跑出來的，不是照官方文件轉述。其他作業系統的畫面可能略有差異。

## 它長這樣

以下是實機輸出的節錄，已移除個人資料：

```text
┌─────────────────────────────────────────────────────────┐
│                 🩺 Hermes Doctor                        │
└─────────────────────────────────────────────────────────┘

◆ Security Advisories
  ✓ No active security advisories

◆ Python Environment
  ✓ Python 3.11.14
  ✓ Virtual environment active
  ✓ Version files consistent (0.17.0)

◆ Configuration Files
  ✓ ~/.hermes/.env file exists
  ✓ API key or custom endpoint configured
  ✓ ~/.hermes/config.yaml exists
  ✓ Config version up to date (v30)

◆ Auth Providers
  ⚠ Nous Portal auth (not logged in)
  ⚠ xAI OAuth (not logged in)
    → No xAI OAuth credentials stored. Select xAI Grok OAuth
      (SuperGrok / Premium+) in `hermes model`.

◆ External Tools
  ✓ git
  ✓ ripgrep (rg) (faster file search)
  ⚠ docker not found (optional)
  ✓ Node.js

────────────────────────────────────────────────────────────
  Found 3 issue(s) to address:

  1. web workspace has 5 npm vulnerabilities
  2. ui-tui workspace has 3 npm vulnerabilities
  3. Run 'hermes setup' to configure missing API keys for full tool access

  Tip: run 'hermes doctor --fix' to auto-fix what's possible.
```

## 16 個區塊各自在檢查什麼

實機跑出來的區塊標題與順序如下：

| # | 區塊 | 它在確認的事 |
|---|---|---|
| 1 | Security Advisories | 有沒有生效中的安全公告 |
| 2 | MCP Server Security | config 裡有沒有可疑的 MCP stdio 指令 |
| 3 | Python Environment | Python 版本、虛擬環境是否啟用、版本檔是否一致 |
| 4 | SSL / CA Certificates | 憑證包有效嗎（連不上模型常是這裡） |
| 5 | Required Packages | 必要與選配套件（telegram、discord 等） |
| 6 | Configuration Files | `.env` 與 `config.yaml` 存在嗎、config 版本是否為最新 |
| 7 | xAI Model Retirement | 設定裡有沒有已退役的 xAI 模型 |
| 8 | Auth Providers | 各家供應商的登入狀態 |
| 9 | Directory Structure | `~/.hermes/` 下的目錄、`SOUL.md`、`MEMORY.md`、`USER.md`、`state.db` |
| 10 | Command Installation | 進入點與 `~/.local/bin/hermes` 是否就位 |
| 11 | External Tools | git、ripgrep、docker、Node.js、瀏覽器自動化相依 |
| 12 | API Connectivity | 設定好的供應商實際連得上嗎 |
| 13 | Tool Availability | 每個工具集能不能用，缺哪個環境變數 |
| 14 | Skills Hub | 目錄、lock 檔，以及 GITHUB_TOKEN 的速率限制 |
| 15 | Memory Provider | 用內建記憶還是外部供應商 |
| 16 | Profiles | profile 清單，以及指向已刪除 profile 的孤兒別名 |

## 最重要的閱讀方法：⚠ 不等於壞掉

第一次跑 `hermes doctor`，畫面上會有一整排黃色 ⚠，很嚇人。但實測下來，這些 ⚠ 大多是「**這個東西你沒設定**」，不是「這個東西壞了」。

三種常見的 ⚠，含意完全不同：

- **`⚠ xAI OAuth (not logged in)`**：你沒登入那家供應商。如果你根本不用 xAI，這一行永遠會是黃的，而且完全沒關係。
- **`⚠ docker not found (optional)`**：括號裡的 `optional` 是關鍵字。你不跑 Docker 部署就不用理它。
- **`⚠ web (missing EXA_API_KEY, TAVILY_API_KEY, ...)`**：這個工具集要用得起來需要那些金鑰。你不用網路搜尋工具就不用補。

真正要看的是最後那段 `Found N issue(s) to address:`。那才是它整理過、認為你該處理的清單。

## 兩件官方沒講、但你該知道的事

### 一、離開代碼永遠是 0，不要拿它當自動化判斷

實測：即使結尾明明寫著 `Found 3 issue(s) to address`，指令的離開代碼仍然是 `0`。

```bash
hermes doctor > /dev/null 2>&1; echo "exit=$?"
# 實測輸出：exit=0
```

這代表**你不能在 CI 或健康檢查腳本裡靠 `hermes doctor` 的離開代碼判斷環境是否正常**。要自動化就得解析輸出文字，例如抓 `Found` 那一行。

### 二、`hermes status --all` 在舊版會把 API 金鑰完整印出來

`hermes status --all` 的說明文字寫著 `Show all details (redacted for sharing)`（顯示所有細節，已遮蔽可分享）。

**在 v0.17.0 上實測，這句話不成立。** 輸出裡的 Google / Gemini 金鑰是完整明文，沒有遮蔽。

上游修正 PR [#55576](https://github.com/NousResearch/hermes-agent/pull/55576) 已於 2026 年 6 月 30 日合併[^1]，也就是 v0.18.0（2026 年 7 月 1 日發布[^5]）之後的版本應該已經修好。這個問題在上游被修過很多次，光是標題含 redact 的 issue 與 PR 就有十筆以上，其中多筆未被合併[^2]。

實務上的規則：

1. 貼出去之前，先用 `hermes version` 確認你的版本
2. v0.18.0 以前，**不要**把 `hermes status --all` 的輸出直接貼進 issue、聊天室或截圖
3. 真的要貼，先自己掃一遍：

```bash
hermes status --all | grep -nE 'sk-|ghp_|xoxb-|AIza'
```

**預期輸出**：什麼都沒印出來（沒有任何一行命中）才是安全的。只要有任何一行被印出來，那一行就含明文金鑰，先遮掉再貼。

> 📝 **待驗證**：本站沒有在 v0.18.0 以上的版本實測過遮蔽是否真的生效。
> 如果你手上是新版，[幫我們補上實測結果](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/hermes-doctor.md)。

## 想更嚴格的供應鏈掃描

`hermes doctor` 的安全檢查是輕量的。要真的掃相依套件漏洞，用另一支：

```bash
hermes security audit
```

**預期輸出**：每一筆命中會印出嚴重度、套件與版本、公告編號，以及修好的版本。實機節錄（v0.17.0）：

```text
  UNKNOWN   Pygments==2.19.2  PYSEC-2026-2987
           Pygments has Regular Expression Denial of Service (ReDoS) due to
           Inefficient Regex for GUID Matching
           fixed in: 2.20.0
  UNKNOWN   starlette==1.0.1  PYSEC-2026-248
           fixed in: 1.3.0
```

`fixed in:` 那一行是重點：它直接告訴你升到哪個版本就沒事。這類命中通常代表**你的 Hermes 該更新了**，因為相依套件是跟著 Hermes 版本走的。

它針對 OSV.dev 做一次性掃描，涵蓋 Hermes 的 venv（已安裝的 PyPI 套件）、`~/.hermes/plugins/` 底下外掛宣告的 Python 相依，以及 `config.yaml` 裡釘住版本的 npx / uvx MCP server[^3]。

**注意：`hermes security audit` 的離開代碼也是 0**，即使掃出一堆漏洞。跟 `hermes doctor` 一樣不能拿來當自動化的判斷依據。

**它不掃**全域安裝的套件，也不掃編輯器或瀏覽器擴充。這個邊界要記住：掃過乾淨不代表整台機器乾淨。技能與 MCP server 是會被 agent 直接執行的程式碼，相關的供應鏈風險見[Hermes Agent 跟 OpenClaw 差在哪](/concepts/龍蝦殺手/)的技能安全段。

## 其他旗標

| 指令 | 用途 |
|---|---|
| `hermes doctor --fix` | 嘗試自動修復能修的項目[^4] |
| `hermes doctor --ack <ID>` | 確認某個安全公告，之後啟動時不再跳橫幅[^4] |
| `hermes status --deep` | 執行較慢的深度檢查[^4] |

## 常見問題

### doctor 全綠了，功能還是不動？

那代表問題不在環境層，往上一層查。照[排錯的正確順序](/troubleshoot/overview/)的四層法走：執行檔、設定檔、模型連線、功能。

### `Config version up to date (v30)` 是什麼意思？

`config.yaml` 有自己的結構版本號。Hermes 更新時會做設定遷移，這一行是在確認你的設定檔已經遷移到目前版本。想理解設定檔全貌見 [config.yaml 是什麼](/config/config-yaml-reference/)。

### 孤兒別名（Orphan alias）要處理嗎？

那是指向已經被刪掉的 profile 的捷徑名稱。不影響運作，但會一直出現在報告裡。用 `hermes profile` 相關指令清掉即可。

## 下一步

- 想知道排查的整體順序 → [排錯的正確順序](/troubleshoot/overview/)
- 設定檔到底怎麼運作 → [config.yaml 是什麼](/config/config-yaml-reference/)
- 模型連不上 → [API key not set / API key 無效怎麼解](/troubleshoot/api-key-not-set/)
- 指令找不到 → [command not found 怎麼解](/troubleshoot/command-not-found/)

[^1]: NousResearch/hermes-agent, PR #55576「fix: redact status --all API keys, harden compression message handling」，merged 2026-06-30，2026-07-29 經 GitHub API 確認合併狀態：https://github.com/NousResearch/hermes-agent/pull/55576
[^2]: GitHub Search API，`repo:NousResearch/hermes-agent redact status in:title` 共 11 筆，其中 #41776、#37050 等多筆 closed 但未合併，2026-07-29 查詢：https://github.com/NousResearch/hermes-agent/issues?q=redact+status+in%3Atitle
[^3]: 本機實測 `hermes security --help`（macOS、v0.17.0、2026-07-29），原文：「Covers the Hermes venv (installed PyPI dists), Python deps declared by plugins under ~/.hermes/plugins/, and pinned npx/uvx MCP servers in config.yaml. Does NOT scan globally-installed packages or editor/browser extensions.」官方指令說明見：https://hermes-agent.nousresearch.com/docs
[^4]: 本機實測 `hermes doctor --help` 與 `hermes status --help`（macOS、v0.17.0、2026-07-29）列出的旗標。官方文件見：https://hermes-agent.nousresearch.com/docs
[^5]: Nous Research, Hermes Agent v0.18.0 (v2026.7.1)：The Judgment Release，發布日期 2026-07-01，本站中文解讀見 [v0.18.0 Judgment](/releases/v2026-7-1/)：https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.1
