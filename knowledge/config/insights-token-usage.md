---
title: "hermes insights：搞清楚 token 花在哪，但它不會告訴你花了多少錢"
description: "官方說明寫著會顯示 costs，實測沒有任何金額。這篇教你怎麼讀這份報表、為什麼 Total tokens 不能拿去乘單價，以及看完之後該調哪個設定。macOS v0.17.0 實測。"
date: 2026-07-29
subcategory: "cost"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "config"
  - "cost"
  - "usage"
status: "published"
---

供應商帳單來了，數字比你以為的高。問題是你不知道錢燒在哪：是某個模型太貴，是某支工具一直重複讀檔，還是某天晚上失控跑了一輪長任務。

Hermes Agent 內建一支報表指令可以回答前半段：

```bash
hermes insights
```

**預期輸出**：一份分成七個區塊的終端機報表，預設分析最近 30 天。看到 `📊 Hermes Insights` 標題框就是成功了。

本篇的所有行為都在 **macOS、Hermes Agent v0.17.0** 上實際跑過。

## 報表長什麼樣

以下是實機輸出的結構，數值已全部換成佔位符：

```text
  ╔══════════════════════════════════════════════════════════╗
  ║                    📊 Hermes Insights                    ║
  ║                       Last 30 days                       ║
  ╚══════════════════════════════════════════════════════════╝

  Period: <起日> - <迄日>

  📋 Overview
  ────────────────────────────────────────────────────────
  Sessions:          <N>           Messages:        <N>
  Tool calls:        <N>           User messages:   <N>
  Input tokens:      <N>           Output tokens:   <N>
  Total tokens:      <N>
  Active time:       <時長>         Avg session:     <時長>
  Avg msgs/session:  <N>

  🤖 Models Used
  ────────────────────────────────────────────────────────
  Model                          Sessions       Tokens
  <模型名稱>                          <N>          <N>

  📱 Platforms
  ────────────────────────────────────────────────────────
  Platform       Sessions   Messages         Tokens
  cli                  <N>        <N>            <N>
  acp                  <N>        <N>            <N>

  🔧 Top Tools
  ────────────────────────────────────────────────────────
  Tool                            Calls        %
  read_file                        <N>      <N>%

  🧠 Top Skills
  ────────────────────────────────────────────────────────
  Skill                          Loads   Edits   Last used
  <技能名稱>                        <N>     <N>      <日期>

  📅 Activity Patterns
  ────────────────────────────────────────────────────────
  Mon  ██              <N>
  ...
  Peak hours: <時段清單>

  🏆 Notable Sessions
  ────────────────────────────────────────────────────────
  Longest session      <時長>      (<日期>, <session id>)
  Most tokens          <N> tokens  (<日期>, <session id>)
```

七個區塊各自回答一個問題[^3]：

| 區塊 | 它回答的問題 |
|---|---|
| Overview | 這段期間總共跑了多少、用掉多少 token |
| Models Used | 哪個模型吃掉最多 token（**成本分析從這裡開始**） |
| Platforms | 你是從 CLI、TUI 還是訊息平台在用它 |
| Top Tools | 哪幾支工具被呼叫最多 |
| Top Skills | 哪些技能真的有在用，載入與編輯次數 |
| Activity Patterns | 星期分布與尖峰時段 |
| Notable Sessions | 最長、訊息最多、token 最多的那幾場 |

## 第一件要知道的事：它不會告訴你花了多少錢

`hermes insights --help` 的說明寫著會分析「token usage, **costs**, tool patterns, and activity trends」[^1]。

**實測輸出裡沒有任何金額欄位。** 七個區塊全部是次數與 token 數，沒有一個顯示幣別或價格。

所以要換算成錢，你得自己做兩步：

1. 從 `🤖 Models Used` 看哪個模型吃掉最多 token
2. 拿那個模型的 token 數去對供應商的計價頁，自己乘

這也表示：**如果你同時用多家供應商，這份報表不會幫你合併帳。** 它只知道 token，不知道你談到什麼價格。

## 第二件：Total tokens 不能拿去乘單價

報表的 `Overview` 區塊同時給了 Input tokens、Output tokens 與 Total tokens。直覺會以為 Total = Input + Output。

**實測不是。** 同一台機器上跑三個不同時間窗，Total 與 (Input + Output) 的比值分別是[^2]：

| 時間窗 | Total ÷ (Input + Output) |
|---|---|
| 最近 7 天 | 約 2.0 倍 |
| 最近 30 天 | 約 11.1 倍 |
| 最近 90 天 | 約 11.1 倍 |

比值不固定，代表 Total 統計的是與 Input / Output 不同維度的東西，不是單純把兩者相加。

> 📝 **待驗證**：Total 多出來的部分是什麼，官方文件沒有說明。合理的猜測是包含快取讀取（cached input）之類不重複計費的 token，但**本站沒有驗證過這個猜測**，不要當結論看。
> 如果你查得到官方定義，[幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/config/insights-token-usage.md)。

實務上的規則很簡單：**估成本用 Input 與 Output，不要用 Total。** 那兩個欄位才對得上供應商的計費方式。

## 縮小範圍：兩個旗標

```bash
hermes insights --days 7
```

**預期輸出**：標題框變成 `Last 7 days`，`Period:` 那行跟著縮短。預設是 30 天。

```bash
hermes insights --days 30 --source cli
```

`--source` 依平台過濾（`cli`、`telegram`、`discord` 等）。想知道「掛在 Telegram 上那隻到底吃掉多少」就用這個。

## 看完之後該調什麼

報表本身不會幫你省錢，它只是告訴你該往哪裡看。三個常見的對應動作：

**如果 `Models Used` 顯示主要模型吃掉絕大多數 token**，那就是讓子代理與背景任務改跑便宜模型，主模型只處理需要它的部分。設定方式見[模型供應商與 API key 設定](/config/model-provider/)的省錢段落。

**如果 `Top Tools` 顯示 `read_file` 或 `search_files` 次數異常高**，通常代表 agent 在重複讀同一批檔案。把專案慣例寫進記憶或技能，讓它不必每次重新摸索，見[記憶系統](/concepts/記憶系統/)。

**如果 `Notable Sessions` 有一場 token 數遠超其他**，那場多半是失控的長任務。搭配 `hermes sessions` 把它找出來看發生什麼事，比盲目調參數有用。

## 常見問題

### 報表裡出現我沒看過的模型名稱？

`Models Used` 是從 session 歷史統計的，包含你試過但後來沒用的模型，也包含設定錯誤時留下的無效名稱（那些通常 token 數是 0）。token 數為 0 的那幾行可以忽略。

### 為什麼 Sessions 數字比我印象中多？

每次 `hermes chat` 都會建立一個 session，包括你開了沒講幾句就關掉的。`Avg msgs/session` 偏低通常就是這個原因。

### 想直接看某一場對話的細節？

`hermes insights` 只給統計。要看內容用 `hermes sessions`（list / rename / export / prune / delete），`Notable Sessions` 區塊給的 session id 可以直接拿去查。

## 下一步

- 想直接調模型與省錢設定 → [模型供應商與 API key 設定](/config/model-provider/)
- 設定檔到底怎麼運作 → [config.yaml 是什麼](/config/config-yaml-reference/)
- 環境有沒有問題 → [hermes doctor 到底檢查什麼](/troubleshoot/hermes-doctor/)
- 上下文爆掉怎麼辦 → [context length exceeded 怎麼解](/troubleshoot/context-length-exceeded/)

[^1]: 本機實測 `hermes insights --help`（macOS、v0.17.0、2026-07-29），說明原文：「Analyze session history to show token usage, costs, tool patterns, and activity trends」，旗標為 `--days` 與 `--source`。官方文件見：https://hermes-agent.nousresearch.com/docs
[^2]: 本機實測 `hermes insights` 於 `--days 7 / 30 / 90` 三個時間窗的 Overview 區塊數值（macOS、v0.17.0、2026-07-29），Total 與 Input+Output 的比值分別約 2.0、11.1、11.1，故兩者非相加關係。官方文件未定義 Total 的組成：https://hermes-agent.nousresearch.com/docs
[^3]: 報表區塊名稱與順序逐字取自實機輸出：Overview、Models Used、Platforms、Top Tools、Top Skills、Activity Patterns、Notable Sessions（macOS、v0.17.0、2026-07-29）。官方文件見：https://hermes-agent.nousresearch.com/docs/reference/faq
