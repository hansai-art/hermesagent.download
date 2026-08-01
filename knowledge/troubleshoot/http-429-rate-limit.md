---
title: "看到 HTTP 429 錯誤?那是供應商在限你的速度,不是 Hermes 壞了"
description: "429 的意思是:提供 AI 模型的公司覺得你送太快了,先擋你一下。這不是 Hermes 出問題。Hermes 會自己重試、再自動換備援,但如果對方一直擋,你就得換做法:掛好幾把鑰匙輪流用、升級方案、或換一家供應商。文章附 Gemini、z.ai 的真實例子。"
date: 2026-07-27
subcategory: "api"
hermes_version: ">=2026.5"
last_verified: 2026-07-27
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/user-guide/configuration"
tags:
  - "429"
  - "rate-limit"
  - "api"
  - "troubleshoot"
status: "published"
---

你可能會在畫面上看到這些錯誤字:

```text
HTTP 429 Too Many Requests
429 rate limit exceeded
Rate limited by provider
```

先解釋一下。這裡的「429」是一個號碼。電腦跟電腦溝通時,常常用數字回報現在的狀況,而「429」這個號碼的意思就是:「你送太快了,先慢一點。」

**所以第一件要搞清楚的事:429 不是 Hermes 壞掉,是提供 AI 模型的那家公司在限你的速度**[^1]。

這裡的「供應商」,指的就是把 AI 模型借給你用的公司,例如 OpenRouter、Gemini、z.ai、OpenAI 這些。你的 API key(一把鑰匙,用來證明你有權使用這個服務)、你的設定、你的網路,通通都沒問題。純粹是對方按照你買的方案、或按照它現在有多忙,把你太密集的請求擋了下來。

因為根本不是 Hermes 的問題,所以「重裝 Hermes」「換一種 key 的寫法」這類方向,做了也是白做。

## Hermes 已經幫你做的事

先說一個名詞。這裡講的「一次呼叫」,意思是 Hermes 去跟供應商要一次回答。

當一次呼叫失敗,Hermes 不會馬上放棄。它會**自己重試,預設會重試 3 次**。這個次數是由一個設定值 `agent.api_max_retries` 控制的。要等這 3 次都失敗,它才會啟動備援(備援 = 換一條後路,例如改用另一家供應商繼續跑)[^2]。

所以如果只是偶爾撞一下 429,你通常根本不會發現,Hermes 自己默默處理掉了。

**反過來說,如果你真的看到了 429,代表供應商正在「一直」擋你**。這種情況下,重試沒有用。因為你每重試一次,就是再去撞同一道牆一次。這時候該做的是換一種做法。

## 照這個順序一步一步解

### 1. 先等一下,再試一次(最省事)

429 常常只是因為你在很短的時間內送了太多請求。等個幾十秒、甚至幾分鐘,再送一次,通常就過了[^1]。官方給的第一個建議,就是這句話:「wait and retry」(等一下再重試)。

**怎麼確認成功了**:同一個請求,晚一點重送一次,能正常拿到回應,那就代表只是短時間內送太多而已,不用再往下折騰。

### 2. 臨時換一家供應商(不動你原本的設定)

如果你手上剛好有另一家供應商的 key,可以用「命令列」臨時切過去,不去改你長期的設定[^1]。

(這裡的「命令列」,就是你打字下指令的那個視窗,通常是一整片黑底白字的畫面。)

```bash
hermes chat --provider <其他供應商>
```

這是「我現在馬上就要它動起來」最快的一條路。等你把這個命令列視窗關掉,一切就回到你原本的設定,不會留下任何改動。

### 3. 掛好幾把 key 輪流用(治本,重度使用者一定要看)

如果你是**很常**撞到 429,那真正的病根是:「單獨一把 key,配額不夠你用。」(配額 = 這把鑰匙在一段時間內,被允許用的量。)

Hermes 支援一個做法:**同一家供應商,你可以掛好幾把 key,讓它自動輪流用**,把請求分散開來,不要全擠在同一把鑰匙上[^2]。

設定寫在一種叫 YAML 的檔案裡。(YAML 是一種寫設定的格式,靠「縮排」和「冒號」來記東西,長得很像條列清單。)

```yaml
credential_pool_strategies:
  openrouter: round_robin
```

輪流的方式有四種可以選[^2]:

| 策略 | 它會怎麼做 |
|---|---|
| `round_robin` | 一把接一把,輪流用(最常用的選擇) |
| `fill_first` | 先把第一把用到滿,再換下一把 |
| `least_used` | 每次挑目前用得最少的那把 |
| `random` | 隨機挑一把 |

那幾把 key 要放進一個叫 `.env` 的檔案裡。(`.env` 是一個專門用來放鑰匙、密碼這類機密東西的檔案;所有機密一律放這裡,詳見 [config.yaml 參考](/config/config-yaml-reference/)。)

這件事的道理,就像你原本只有「一條水管」在供水,現在改成「好幾條水管並排一起供」。對那種要長時間一直跑的 agent(agent 就是會自己連續做很多步驟的 AI 幫手)特別有效。

### 4. 升級你的供應商方案

如果上面幾招都撐不住,那答案就很單純了:你的用量已經超過你現在方案的上限。升級到更高的付費層,通常會直接把速度上限拉高[^1]。

### 5. 換一個模型,或換一家供應商

有些供應商,在尖峰時段(大家都在用的熱門時間)特別容易限速。換去別家,或是換一個比較沒那麼塞的模型,也是官方列出來的解法之一[^1]。

## 幾個真實案例(看看你是哪一種)

社群回報過的 429,病根其實不完全一樣:

- **Gemini 明明顯示配額還有,卻還是跳 429**:用 `google-gemini-cli` 這個供應商時觸發了 429,但去查 `gquota`(查剩餘額度的工具)卻顯示額度還沒用完。這種情況是供應商那邊「帳面上的計算」和「實際的限速」對不上,遇到時用等待、或換 key 輪替,會比較有效([原始討論](https://github.com/NousResearch/hermes-agent/issues/10210) 就是這一類供應商端的問題)。
- **z.ai 在尖峰時段限速**:`zai/glm` 這一系列的模型,在尖峰時段會對 Hermes 限速。避開尖峰、或掛多把 key 輪流用,可以緩解。
- **HTTP 529 Overloaded**:這個跟 429 長得很像,但其實不一樣。529 的意思是供應商**整台伺服器全面過載**了(不是特別針對你限速,是它自己忙不過來)。這種一樣不能靠重試解決,做法也一樣:等一下,或換一家供應商。MiniMax 就出現過反覆跳 529 的情況。

## 常見問題

### 我把 `api_max_retries` 調得很高,不就好了嗎?

不建議。當供應商是持續在擋你的時候,把重試次數調高,只是讓你更用力、更多次去撞同一道牆而已,而且還可能被供應商當成惡意濫用。真正的病根是配額不夠。該做的是輪流用多把 key、或升級方案,不是拼命重試[^2]。

### 429 跟「呼叫默默卡住不動」是同一件事嗎?

不是。如果是一直卡住,卡到觸發一個叫 stale timeout 的逾時(由環境變數 `HERMES_API_CALL_STALE_TIMEOUT` 控制,預設 90 秒),那通常是連線問題或資料傳輸中斷的問題,不是限速[^2]。(環境變數 = 電腦裡一個有名字的設定值,程式跑的時候會去讀它。)而 429 不一樣,它會明確回一個錯誤代碼給你看。

### 我要怎麼分辨,到底是 429、還是我 key 設錯了?

如果是 key 設錯,回給你的號碼會是 401 或 403(意思是「你沒有權限」),不會是 429。看到 429,反而代表你的 key 是對的,只是你送太頻繁了。如果懷疑是 key 沒設好,請看 [API key not set](/troubleshoot/api-key-not-set/)。

## 下一步

- 多把 key 要放哪、怎麼設 → [config.yaml 參考](/config/config-yaml-reference/)
- key 根本沒被讀到(回 401/403)→ [API key not set](/troubleshoot/api-key-not-set/)
- 對話太長被擋下來(context length)→ [context length exceeded](/troubleshoot/context-length-exceeded/)

[^1]: Nous Research, FAQ(Rate limiting / 429):https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-27 存取)。429 =「已超過供應商速率上限」;建議動作:等待重試、升級方案、換模型或供應商、`hermes chat --provider <alternative>` 切換後端
[^2]: Nous Research, Configuration:https://hermes-agent.nousresearch.com/docs/user-guide/configuration (2026-07-27 存取)。`agent.api_max_retries` 預設 3(重試耗盡才啟動備援);`credential_pool_strategies.<provider>` 支援 fill_first / round_robin / least_used / random 多金鑰輪替;`HERMES_API_CALL_STALE_TIMEOUT` 預設 90 秒為非串流停滯偵測
