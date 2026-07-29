---
title: "輸入 plan 後 Broken pipe：不是 plan 壞了，是長需求加 skill 把首包拖到逾時"
description: "macOS v0.17.0 實機案例：長需求一開始就觸發 plan skill，下一次請求 context 膨脹到約 1.9 萬 token，openai-codex 90 秒沒有首包後被 Hermes 主動斷線。教你怎麼救、怎麼避免。"
date: 2026-07-29
subcategory: "runtime"
hermes_version: "0.17.0"
last_verified: 2026-07-29
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/slash-commands"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/features/skills"
  - "https://github.com/NousResearch/hermes-agent/blob/main/run_agent.py"
  - "https://github.com/NousResearch/hermes-agent/blob/main/agent/chat_completion_helpers.py"
tags:
  - "troubleshoot"
  - "runtime"
  - "plan"
  - "broken-pipe"
status: "published"
---

你貼了一大段需求，下一行只打 `plan`，結果 Hermes 跑到一半噴：

```text
API call failed after 3 retries: [Errno 32] Broken pipe
```

這種錯最容易被誤判成「plan 指令壞了」。本站在一台 macOS、Hermes Agent v0.17.0、openai-codex provider 的機器上實測與查 log 後，真正原因比較像：**長需求 + plan skill + 非串流首包逾時**疊在一起。

## 實機發生了什麼

那次案例的流程是：

1. 使用者先貼一大段需求
2. 接著輸入 `plan`
3. Hermes 真的載入了 `plan` skill
4. `plan` skill 又開始準備寫 `.hermes/plans/...md`
5. 下一次模型請求的 context 從約 1.4 萬 token 膨脹到約 1.9 萬 token
6. openai-codex 那次非串流請求 90 秒沒有收到首包
7. Hermes 主動殺掉連線，最後表現成 `Broken pipe`

實機 log 裡看到的關鍵句是：

```text
Non-streaming API call stale for 90s ... Killing connection
```

所以重點不是 `plan` 這四個字本身，而是它會讓 Hermes 進入規劃工作流：載入技能內容、讀上下文、產出計畫檔。當你同一輪已經塞了很長需求，它就更容易把下一次請求推到慢首包或 stale timeout。

## 先救火：不要在同一輪繼續硬撞

如果你正在同一個長 session 裡，先做兩件事：

```text
/compress
```

**成功判準**：壓縮完成後能繼續對話，不再立刻進入上下文壓力。

接著不要再直接丟 `plan`，先要求它只整理需求：

```text
先不要寫計畫。請只把我剛才的需求整理成 10 條內的工作範圍、驗收條件與風險。
```

等這輪成功回來，再開新 session 或再輸入 `plan`。

## 最穩用法：長需求拆兩輪

比較穩的節奏是：

```text
第一輪：
我會貼一段長需求。請只做需求整理，不要啟動 plan，不要寫檔。

第二輪：
根據剛才整理過的需求，進入 plan 模式，寫一份可執行計畫。
```

這樣做的目的很單純：不要讓「原始長需求」、「skill 內容」、「規劃輸出」全部擠在同一個模型請求裡。

## 如果你常用 openai-codex：可以調 stale timeout

Hermes 的 stale timeout 有優先順序：模型層設定、provider 層設定、`HERMES_API_CALL_STALE_TIMEOUT`，最後才是預設 90 秒[^3]。

實機當時把 openai-codex provider 的逾時從 90 秒拉到 180 秒後，短查詢恢復穩定：

```yaml
providers:
  openai-codex:
    stale_timeout_seconds: 180
```

**成功判準**：

```bash
hermes chat -q 'Reply with exactly: OK' --toolsets safe --quiet
```

預期輸出：

```text
OK
```

這不是根治，只是讓慢首包多一點時間。如果 session 已經大到十萬 token，調 timeout 只會讓你等更久；那時候應該開新 session。

## 怎麼判斷是不是這個問題

看三個訊號：

| 訊號 | 意思 |
|---|---|
| 錯誤含 `Broken pipe` | 連線已被關掉，不代表真正根因一定是 pipe |
| log 有 `Non-streaming API call stale` | Hermes 等不到首包，主動殺連線 |
| 同一輪剛載入 skill 或貼很長內容 | 高機率是上下文變重導致慢首包 |

如果你只是問一句短問題也 Broken pipe，那就不像這篇的案例，應該回到[排錯的正確順序](/troubleshoot/overview/)先查 provider 連線與 API 狀態。

## 預防規則

- 長需求不要第一輪就打 `plan`
- 先整理需求，再進 plan
- 一個任務完成就開新 session，不要把所有案子堆在同一場
- 需要測 provider 是否還活著時，用 `--toolsets safe` 跑最小查詢
- timeout 可以調，但不要用它掩蓋過胖 session

## 下一步

- 對話真的太長 → [context length exceeded 怎麼解](/troubleshoot/context-length-exceeded/)
- 想看 token 花在哪 → [hermes insights](/config/insights-token-usage/)
- 想理解 skill 載入 → [Skills 系統](/skills/skills-mcp-overview/)

[^1]: 本站實機案例（macOS、Hermes Agent v0.17.0、openai-codex、2026-06-30）：長需求後輸入 `plan`，session 紀錄確認第一步載入 `skill_view(name="plan")`，後續 log 出現 `Non-streaming API call stale for 90s ... Killing connection`，最終使用者看到 `API call failed after 3 retries: [Errno 32] Broken pipe`。
[^2]: Nous Research, Slash Commands：`/compress`、`/skills`、`/skill <name>` 等指令為互動 session 功能；`plan` 屬於技能工作流，技能可透過 slash command 或自然語言載入 — https://hermes-agent.nousresearch.com/docs/reference/slash-commands
[^3]: NousResearch/hermes-agent 原始碼：`run_agent.py` 中 stale timeout 優先序為 `providers.<id>.models.<model>.stale_timeout_seconds`、`providers.<id>.stale_timeout_seconds`、`HERMES_API_CALL_STALE_TIMEOUT`、預設 90 秒；`agent/chat_completion_helpers.py` 會在 non-streaming 請求 stale 時記錄並殺掉連線 — https://github.com/NousResearch/hermes-agent/blob/main/run_agent.py
