---
title: "什麼是 Hermes Agent"
description: "用五分鐘搞懂 Hermes Agent 是什麼、跟其他 AI 助手差在哪:會自己學會新技能的它、能跑在 20 多個平台上、還有一個不必你守著筆電的 agent。"
date: 2026-07-23
subcategory: "basics"
hermes_version: ">=0.14"
last_verified: 2026-07-23
translationKey: what-is-hermes-agent
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs"
  - "https://github.com/NousResearch/hermes-agent"
tags:
  - "basics"
  - "overview"
  - "concepts"
status: "published"
---

先想像一個很常見的畫面。

你跟一個 AI 助手聊了半天,把專案怎麼擺、密碼放哪、你喜歡怎麼寫程式都講清楚了。結果你一關掉視窗,它就全忘了。下次打開,你又得從頭再講一遍。每一次對話,都像第一次見面。

Hermes Agent 想解決的,就是這件事。

它是 Nous Research 這家公司做的一個開源 AI agent。這裡先解釋兩個詞。「開源」的意思是程式碼公開、任何人都能免費拿去用。「agent」你可以想成一個「會自己動手做事的 AI 助理」:你交代一件事,它不只是回你一段文字,而是真的去操作、去完成。

官方給它的定位是:「唯一內建學習迴圈(learning loop)的 agent」。「學習迴圈」聽起來很玄,其實就是一句話，它會愈用愈聰明。它會從實際做事的過程中學到新本事、在反覆使用中把這些本事磨得更好,還會跨越很多次對話,慢慢拼出一個「你是誰、你怎麼做事」的印象[^1]。

## 三件讓它不一樣的事

### 一、它會自己學會新技能

大部分的 agent 能做什麼,是工程師事先寫死的。它們不會自己長出新能力。

Hermes 不一樣。它有一種東西叫「技能(skill)」。你可以把技能想成「它自己記下來的一套做事步驟」。

舉個例子。它幫你處理某個專案時,摸索出「這個專案要先跑 lint、再跑 build」這個順序(lint 是幫程式碼挑錯的檢查工具,build 是把程式碼打包成可以執行的成品)。它發現這招有效,就會把這整套流程存成一個技能。下次再碰到類似的任務,它直接把這個技能拿出來用,而且一邊用一邊繼續修正[^2]。

官方把這個過程叫「閉合的學習迴圈」,其實就是一個轉圈圈:做事拿到經驗 → 把經驗存成技能 → 下次拿出來用 → 用的時候再改良 → 於是下次做得更好。

對你的實際意義是:你不用一直重複教它同一件事。教過一次,它就記住了做法。

### 二、它不綁在你的筆電上

一般的 AI 工具,大多只能跑在你面前這台電腦。

Hermes 可以跑在六種不同的地方(官方叫「執行環境」,就是「這個 agent 實際在哪裡運作」的意思):你自己電腦上的終端機、Docker、透過 SSH 連過去的遠端主機、Daytona、Singularity,還有 Modal 的無伺服器部署[^3]。這裡也順手解釋幾個名詞:終端機是那個打指令的黑色文字視窗;Docker 是一種把程式連同它需要的環境一起打包起來、到哪都能跑的技術;SSH 是一種安全連到遠端電腦的方式;「無伺服器部署」的重點是它閒著沒事時會自動休眠,不佔資源。

真正好玩的地方在使用場景。你可以讓它跑在遠端的雲端主機上,然後你人在外面,用手機從 Telegram 丟一句話給它,它在雲端把事做完再回報給你。你完全不用守在筆電前面。

官方目前支援 20 多個訊息平台:Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Email、Microsoft Teams、Google Chat 等等[^4]。也就是說,你平常在用哪個聊天軟體,多半就能直接拿它來指揮 Hermes。

### 三、記憶不會因為換一次對話就消失

這裡先解釋一個詞:「session」。一個 session 大致就是「一段對話」。很多 AI 一旦開新的一段對話,前面講過的就忘光了。

Hermes 的記憶是會一直累積的。它的記憶分兩塊。一塊是常駐的「核心記憶」,存的是你的偏好、專案的慣例這類最常用到的東西。另一塊是一個「全文檢索」，你可以想成一個能翻遍你們過去所有對話的搜尋功能。而且它搜出來的是**當初的逐字原文,不是 AI 幫你濃縮過的摘要**[^6]。

這一點很重要。這代表三個月前你隨口告訴它的偏好、給過它的密碼放在哪、這個專案有什麼特殊規矩,下次它都還撈得回來,而且是原話,不會愈傳愈走樣。想更深入了解,可以看 [記憶系統](/concepts/記憶系統/)。

## 你會用到的幾個名詞

下面這張表,把文件裡常出現的詞用一句話講清楚,方便你之後對照。

| 名詞 | 是什麼 |
|---|---|
| 技能(skill) | agent 自己建立、之後能重複拿來用的操作流程 |
| 記憶系統(memory) | 跨越多次對話、持續累積的知識庫 |
| 工具集(toolset) | 內建 60 多種工具,可以自由組合搭配 |
| 閘道(gateway) | 把各個訊息平台接進來的統一入口 |
| 子代理(subagent) | 派出去、可以同時平行做事的獨立小 agent |
| MCP | 一種標準接頭,讓你接上任何 MCP server 來擴充它的工具能力 |

## 要花多少錢

Hermes Agent 這個程式本身是 **MIT 授權的開源專案,完全免費**[^5](MIT 授權你可以理解成一種很寬鬆的開源條款,基本上讓你免費用、隨你改)。

那錢花在哪?花在「模型供應商」。這裡解釋一下:Hermes 自己不會思考,它背後要接一個 AI 模型來當大腦,而提供這個大腦的公司就是模型供應商,通常會按使用量收費。

Hermes 支援 Nous Portal、OpenRouter、OpenAI,或任何相容的 endpoint(endpoint 就是「模型服務的連線地址」)。所以貴的、便宜的模型你都能自己挑,甚至可以用 Ollama 在自己電腦上跑本地模型,那樣就完全不花錢。

## 下一步

- 想直接裝起來用 → [安裝部署](/install/)
- 裝好了不知道選哪個模型 → [模型供應商與 API key 設定](/config/model-provider/)
- 深入記憶怎麼運作 → [記憶系統](/concepts/記憶系統/)
- 深入技能怎麼長出來 → [技能系統](/concepts/技能系統/)
- 它跟 OpenClaw(龍蝦)到底差在哪 → [逐條查證兩邊官方文件,順便拆「龍蝦殺手」這個稱號](/concepts/龍蝦殺手/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)

[^1]: Nous Research, Hermes Agent 官方文件:https://hermes-agent.nousresearch.com/docs (2026-07-23 存取)
[^2]: 同上,Skills 章節:「Procedural memory the agent creates and reuses」
[^3]: 同上,部署選項章節(本機 / Docker / SSH / Daytona / Singularity / Modal)
[^4]: 同上,Gateways 章節:「20+ platforms from one gateway」
[^5]: NousResearch/hermes-agent, MIT License:https://github.com/NousResearch/hermes-agent
[^6]: Nous Research, Memory:session_search 回傳資料庫原文,不做 LLM 摘要:https://hermes-agent.nousresearch.com/docs/user-guide/features/memory
