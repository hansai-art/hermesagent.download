---
title: "什麼是 Hermes Agent"
description: "用五分鐘搞懂 Hermes Agent 是什麼、跟其他 AI 助手差在哪:會自己長出技能的學習迴圈、跑在 20 多個平台上、以及一個你不必守著筆電的 agent。"
date: 2026-07-23
subcategory: "basics"
hermes_version: ">=0.14"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://github.com/NousResearch/hermes-agent"
tags:
  - "basics"
  - "overview"
  - "concepts"
status: "published"
---

大部分 AI 助手在你關掉視窗那一刻就失憶了。下次你得重新解釋一遍專案結構、重新貼一次憑證、重新教它你偏好的寫法——每一次對話都從零開始。

Hermes Agent 想解決的就是這件事。它是 Nous Research 開發的開源 AI agent,官方定位是「唯一內建學習迴圈(learning loop)的 agent」:它會從實際經驗中長出自己的技能(skill)、在使用中持續改良這些技能,並且跨越多次對話累積出一個關於「你是誰」的模型[^1]。

## 三件讓它不一樣的事

### 一、它會自己長出技能

多數 agent 的能力是開發者寫死的。Hermes 的「技能」是**程序性記憶**——當它摸索出一套可行的做法(例如「這個專案要先跑 lint 再 build」),它會把這套流程存成技能,下次遇到類似任務直接調用,並在用的過程中持續修正[^2]。

這也是為什麼官方稱它為「閉合的學習迴圈」:經驗 → 技能 → 使用 → 改良 → 更好的經驗。

### 二、它不綁在你的筆電上

Hermes 支援六種執行環境:本機終端機、Docker、SSH 遠端、Daytona、Singularity,以及 Modal 的無伺服器部署(閒置時自動休眠)[^3]。

真正的差別在使用場景:你可以讓它跑在遠端,然後從 Telegram 丟一句話給它,它在雲端做完事再回報。官方目前支援 20 多個訊息平台——Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Email、Microsoft Teams、Google Chat 等[^4]。

### 三、記憶跨越 session

Hermes 的記憶系統會持續累積,並支援跨 session 的全文檢索與摘要。這代表三個月前你告訴它的偏好、給過的憑證位置、專案的特殊慣例,它下次還記得。

## 你會用到的幾個名詞

| 名詞 | 是什麼 |
|---|---|
| 技能(skill) | agent 自己建立與重用的操作流程 |
| 記憶系統(memory) | 跨 session 持續累積的知識庫 |
| 工具集(toolset) | 內建 60 多種工具,可自由組合 |
| 閘道(gateway) | 連接各訊息平台的統一入口 |
| 子代理(subagent) | 分派出去平行處理的獨立 agent |
| MCP | 接上任何 MCP server 擴充工具能力 |

## 要花多少錢

Hermes Agent 本體是 **MIT 授權的開源專案,免費**[^5]。你付的是模型供應商的費用——它支援 Nous Portal、OpenRouter、OpenAI,或任何相容的 endpoint,所以你可以自己選貴的或便宜的模型,甚至用 Ollama 跑本地模型完全不花錢。

## 下一步

- 想直接裝起來用 → [安裝部署](/install/)
- 裝好了不知道選哪個模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 想看它能做什麼 → [技能目錄](/skills/catalog/)

[^1]: Nous Research, Hermes Agent 官方文件 — https://hermes-agent.nousresearch.com/docs(2026-07-23 存取)
[^2]: 同上,Skills 章節:「Procedural memory the agent creates and reuses」
[^3]: 同上,部署選項章節(本機 / Docker / SSH / Daytona / Singularity / Modal)
[^4]: 同上,Gateways 章節:「20+ platforms from one gateway」
[^5]: NousResearch/hermes-agent, MIT License — https://github.com/NousResearch/hermes-agent
