---
title: "Hermes Agent 官方 Issue Top 10：最多人反應的問題與提案"
description: "依官方 GitHub reactions 數排序的前 10 名 issue 中文摘要：最多人遇到的 bug 與最多人想要的功能，每筆附原始連結與狀態。"
date: 2026-07-23
subcategory: "curated"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://github.com/NousResearch/hermes-agent/issues/32892"
  - "https://github.com/NousResearch/hermes-agent/issues/32883"
  - "https://github.com/NousResearch/hermes-agent/issues/18080"
  - "https://github.com/NousResearch/hermes-agent/issues/38602"
  - "https://github.com/NousResearch/hermes-agent/issues/25267"
  - "https://github.com/NousResearch/hermes-agent/issues/514"
tags:
  - "curated"
status: "published"
---

依官方 GitHub 的 reactions 數排序：最多人按讚的 bug 回報與功能提案，等於整個社群「最痛的問題」與「最想要的方向」。排序資料每日同步，狀態由官方 label 推導。

No.1．55 reactions．38 則討論

#32892 已修復 P3 comp/agent

### Bug：Hermes 使用 OpenAI Codex（ChatGPT）時噴出 'NoneType' object is not iterable 錯誤

此 issue 回報在使用 Provider 為 openai-codex、Model 為 gpt-5.5 時，透過 Telegram 或 CLI 傳送任何訊息都會噴出 'NoneType' object is not iterable 錯誤，並被當成不可重試的用戶端錯誤中斷。回報者認為 Hermes 呼叫 ChatGPT Codex 後端 API 端點時應妥善處理所有分支，不應因 Python 端的 None 值而直接出錯。此 issue 已關閉。

官方 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/32892)

No.2．52 reactions．16 則討論

#32883 已修復 P2 comp/agent

### 修正 Codex stream 回傳 None 時的還原機制

此 issue 描述 OpenAI Codex Responses 後端在串流結束時可能回傳 response.output 為 None，導致 OpenAI SDK 的 stream parser 直接崩潰、被 Hermes 誤判為不可重試的用戶端錯誤。作者提出修補方式，包含從已串流的 output items / text delta / reasoning delta 回填缺漏的 output、在 SDK stream parser 崩潰時改用 responses.create(stream=True) 作為 fallback，並針對 output_text 的存取加上防護與新增回歸測試。此 issue 已關閉。

官方 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/32883)

No.3．52 reactions．26 則討論

#18080 有暫時解法 P2 comp/dashboard

### [Feature] Dashboard 主題可讀性差，希望新增更易讀的主題

回報者認為 Dashboard 現有主題（Midnight、Ember、Mono、Cyberpunk、Rose）只是換色，字體偏襯線、字重輕、對比低，導致整體很難閱讀。因此提出希望新增一個或多個更符合主流 UI 標準（字體、字級、字重、對比）的主題，偏好深色模式，並以 Linear 的清晰易讀作為參考範例。

社群 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/18080)

No.4．45 reactions．8 則討論

#38602 討論中 P3 comp/desktop

### [Feature] 支援桌面版 Hermes 以純用戶端模式安裝，連線遠端 Hermes

回報者想把 Hermes Desktop 安裝成連線到遠端既有 Hermes 服務的輕量用戶端，但現況是只要偵測不到本機安裝，桌面 App 就一定會在首次啟動時自動跑 electron/main.cjs 裡的 bootstrap，執行 install.ps1 安裝 Python、Node 等依賴，沒有官方提供的純用戶端安裝版本。

**暫時解法**

body 提到可在首次啟動前先設定環境變數 HERMES_DESKTOP_REMOTE_URL 與 HERMES_DESKTOP_REMOTE_TOKEN，讓桌面 App 改連線遠端後端、跳過本機後端啟動；但 Electron 外殼本身仍會被安裝，且一旦取消設定這兩個環境變數，下次啟動仍會嘗試 bootstrap 本機環境。

社群 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/38602)

No.5．41 reactions．8 則討論

#25267 討論中 P3 comp/plugins

### [Feature] 希望 Hermes 支援用 Claude 訂閱 OAuth 當作 Agent SDK 的 model provider（比照 Codex 模式）

回報者指出現有的 anthropic provider 需要 Developer Platform API key 並另外計費，導致已訂閱 Claude 的使用者形同重複付費（訂閱費 + API token 費）。文中引用 Anthropic 官方說明，指出 2026 年 6 月 15 日起 Agent SDK 與 claude -p 的用量會與互動式訂閱額度脫鉤，改為每月獨立的 Agent SDK 額度（依方案不同為 20~200 美元），且此額度明確涵蓋透過 Agent SDK 以 Claude 訂閱驗證的第三方應用程式。回報者希望 Hermes 能新增一個類似既有 Codex OAuth 憑證池的 Claude 訂閱 OAuth provider，讓這筆額度可以被 Hermes 使用。

社群 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/25267)

No.6．41 reactions．22 則討論

#514 討論中 P3 comp/agent

### [Feature] 支援 A2A（Agent-to-Agent）協定：遠端 Agent 探索、通訊與互通

此 issue 提議讓 Hermes 支援 Google 提出的 A2A（Agent-to-Agent）開放協定，作為與 MCP 互補的機制：MCP 回答「我能用哪些工具」，A2A 回答「誰能幫我」，讓不同框架打造的 agent 能互相探索能力並透過標準 HTTP 協作任務。作者認為 Hermes 已有成熟的 MCP client（tools/mcp_tool.py），適合進一步支援 A2A，讓 Hermes 能呼叫其他框架的遠端 agent，也能被其他系統當作可被 A2A 探索的 agent 呼叫。

社群 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/514)

No.7．35 reactions．25 則討論

#344 已修復

### [Feature] 多 Agent 架構：協調、協作、專職角色與具韌性的工作流程（總覽 issue）

此 issue 是把 Hermes 從單一 agent（可用 delegate_task 產生用完即丟的子 agent，彼此無法溝通、無法共享狀態）演進為真正多 agent 架構的總覽提案，涵蓋具獨立身分與工具集的專職角色、依賴關係感知的工作流程分解、agent 間協作共享 context、當機恢復與卡住偵測，以及跨平台（不同 Discord 頻道、Telegram 群組等）協調。此 issue 已關閉。

官方 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/344)

No.8．30 reactions．7 則討論

#5941 討論中 P3 tool/web

### [Feature] 新增 Searxng 作為預設網頁搜尋 provider 之一（與 Firecrawl、Tavily 並列）

回報者希望在 web_tools.py 以及 setup / 環境變數設定中加入 Searxng，作為 Firecrawl、Tavily 等既有 provider 之外的另一個選項，並附上偵測 SEARXNG_BASE_URL 環境變數與後端選擇邏輯的程式碼草稿。作者也提到未來想加 reranker 步驟，但目前尚未開始。

社群 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/5941)

No.9．29 reactions．7 則討論

#45058 已修復 P3 comp/tools

### Bug：web_search / web_extract 在未經使用者同意下，未設定 API key 也會偷偷把流量導向 Parallel.ai

此 issue 指出某次 commit（PR #43798）改變了 web_search 與 web_extract 在沒有設定任何 backend 時的預設行為：以前預設會落到 firecrawl（沒設 API key 就會在呼叫時失敗），現在則會在使用者完全沒設定 API key、也沒設定 backend 的情況下，靜默把所有搜尋流量導向 Parallel 代管的 search.parallel.ai/mcp 端點，過程沒有任何提示或設定步驟，且後續兩次 commit 又進一步強化這個預設值以防止被覆寫。回報者認為這缺乏使用者同意，也沒有本機/離線 fallback。此 issue 已關閉。

官方 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/45058)

No.10．29 reactions．7 則討論

#9459 討論中 P3 comp/agent

### feat(delegation)：delegate_task 支援自訂 agent profile，打造客製化編排 harness

此 issue 提議讓 delegate_task 能從 config.yaml 中定義的具名 agent profile 產生子 agent，讓使用者不用改 Hermes 核心就能打造類似 oh-my-opencode-slim Pantheon agents 的客製化編排 harness。作者指出目前 delegate_task 產生的子 agent 只是父 agent 的複製品，可自訂的部分很有限：系統提示是寫死的模板、model 全域共用、工具權限只到 toolset 群組層級、且沒有系統化的路由規則來區分 explorer / fixer / reviewer 等角色。

社群 最後檢查 2026-07-04 [原始 issue ↗](https://github.com/NousResearch/hermes-agent/issues/9459)

[回官方 Issue 精選問答](/issues/)�．[逐題排解教學](/troubleshoot/overview/)
