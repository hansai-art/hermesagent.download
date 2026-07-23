---
title: "排錯的正確順序"
description: "亂槍打鳥最浪費時間。四層排查法:先確認執行檔、再確認設定、再確認模型、最後才是功能——照順序查,不會白費工。"
date: 2026-07-23
subcategory: "overview"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "overview"
  - "troubleshoot"
status: "published"
---

出錯時最浪費時間的做法,是看到錯誤訊息就直接搜尋那句話,然後照著網路上找到的解法亂試。

因為 agent 是一條鏈:**執行檔 → 設定檔 → 模型連線 → 功能**。任何一環斷掉,症狀都可能表現在後面。你以為是模型的問題,其實是設定沒讀到;你以為是設定錯了,其實是根本裝在另一個環境。

所以照順序查。四層,每層都有一個明確的指令可以驗證。

## 第一層:執行檔存在嗎

```bash
hermes doctor
```

這是官方診斷指令[^1]。**如果連這個指令都找不到**,問題在最外層——不是設定、不是模型,是你的 shell 找不到執行檔。

→ [command not found 怎麼解](/troubleshoot/command-not-found/)(九成是 shell 沒重載 PATH,不是安裝失敗)

**環境搞混也很常見**:在 WSL2 裝的東西,PowerShell 找不到;在系統 Python 裝的,uv 環境裡找不到。先確認你現在這個 shell 就是你安裝時用的那個。

## 第二層:設定讀到了嗎

```bash
hermes config show
```

**完成判準**:輸出裡看得到供應商與模型,而且**是你以為的那個**;key 欄位有值。

兩者任一不對,問題就在這一層。

這一層最常見的陷阱是 `~/.hermes/.env` 裡有舊的、衝突的設定,蓋掉了你剛設的[^1]。

→ [API key not set / 無效怎麼解](/troubleshoot/api-key-not-set/)

## 第三層:模型連得上嗎

```bash
hermes
```

隨便問一句話。這一步會把「設定正確」和「真的能用」分開——設定填對了,但 key 過期、額度用完、模型名稱不存在,都會在這裡才爆出來。

**看錯誤訊息的具體內容**:提到 key 就回第二層;提到 context 或 token 就是第四層;提到模型名稱不存在,回去確認 `HERMES_MODEL` 拼字。

→ [模型供應商與 API key 設定](/config/model-provider/)

## 第四層:功能層

前三層都通了,問題就在具體功能上。這時候症狀通常很明確:

| 症狀 | 看這篇 |
|---|---|
| `context length exceeded` | [怎麼解](/troubleshoot/context-length-exceeded/) |
| `Python 3.11 or newer` | [怎麼解](/troubleshoot/python-version-too-old/) |
| Telegram 指令選單少東西、gateway 斷線 | [怎麼解](/troubleshoot/telegram/) |
| 從 OpenClaw 搬過來後行為怪怪的 | [遷移指南](/migrate/migrate-from-openclaw/) |

## 都不是?那去看 issue

如果上面四層都排除了,很可能你遇到的是已知問題。我們整理了 300 多篇官方 GitHub issue 的中文摘要,依元件分類:

- [Agent 核心](/issues/) · [Gateway 訊息閘道](/issues/) · [CLI](/issues/) · [設定檔](/issues/) · [桌面版](/issues/) · [驗證與 API key](/issues/)

每篇都附原始 issue 連結,可以直接去看討論串或追蹤修復進度。

## 回報問題

確認不是已知問題,而且你覺得這裡的文件應該要寫但沒寫——
[開一個 issue 告訴我們](https://github.com/hansai-art/hermesagent.download/issues/new?template=01-content-error.yml)。
你花時間解出來的東西,下一個人就不用再花一次。

## 下一步

- 從頭開始 → [新手路線](/guides/start/)
- 想看實際案例 → [官方 issue 中文精選](/issues/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
