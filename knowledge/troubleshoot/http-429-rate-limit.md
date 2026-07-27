---
title: "HTTP 429 Too Many Requests:被供應商限速,Hermes 一直重試也沒用"
description: "429 是模型供應商在限你的速,不是 Hermes 壞掉。Hermes 會自動重試再備援,但供應商持續擋時要換做法:多金鑰輪替、升方案、切供應商。含 Gemini/z.ai 實際案例。"
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

你可能看到的錯誤字串:

```text
HTTP 429 Too Many Requests
429 rate limit exceeded
Rate limited by provider
```

**先搞清楚一件事:429 不是 Hermes 的錯,是模型供應商在限你的速**[^1]。你的 API key、設定、網路都沒問題——是對方(OpenRouter、Gemini、z.ai、OpenAI…)按方案或當下負載,擋掉了你太密集的請求。所以「重裝 Hermes」「換 key 格式」這類方向都是白費。

## Hermes 已經幫你做的事

遇到失敗的 API 呼叫,Hermes 不會馬上放棄——它會**自動重試,預設 3 次**(`agent.api_max_retries`),重試用完才啟動備援[^2]。

所以如果只是偶發的 429,你通常不會察覺,它自己吞掉了。**你會看到 429,代表供應商在持續擋**——這時重試沒用,因為每次重試都撞同一道牆。得換做法。

## 照這個順序解

### 1. 先等一下再試(最省事)

429 常常是短時間請求太密。等幾十秒到幾分鐘再送,多半就過了[^1]。官方第一個建議就是「wait and retry」。

**成功判準**:同一個請求稍後重送能正常回應,就是單純的短時間超額,不必再往下弄。

### 2. 臨時切一個供應商(不改設定)

手上有別的供應商 key,用命令列臨時切走,不動你的長期設定[^1]:

```bash
hermes chat --provider <其他供應商>
```

這是「現在就要它動」最快的路。關掉命令列就回到原設定。

### 3. 用多把 key 輪替(治本,重度使用者必看)

如果你**經常**撞 429,根因是「單一 key 的配額不夠你用」。Hermes 支援**同一供應商掛多把 key 自動輪替**,把請求分散開[^2]:

```yaml
credential_pool_strategies:
  openrouter: round_robin
```

輪替策略有四種[^2]:

| 策略 | 行為 |
|---|---|
| `round_robin` | 輪流用每把 key(最常用) |
| `fill_first` | 用滿第一把才換下一把 |
| `least_used` | 挑用得最少的 |
| `random` | 隨機 |

多把 key 放進 `.env`(密鑰一律放這,見 [config.yaml 參考](/config/config-yaml-reference/))。這是把「一條水管」變成「好幾條並聯」,對長時間跑的 agent 特別有效。

### 4. 升級供應商方案

前面都撐不住,就是你的用量超過方案上限了——升級付費層通常直接提高速率上限[^1]。

### 5. 換一個模型或供應商

某些供應商在尖峰時段特別容易限速。換到別家、或換個較不塞的模型,也是官方列的解法之一[^1]。

## 幾個真實案例(對號入座)

社群回報過的 429,病灶不完全一樣:

- **Gemini 顯示配額正常卻噴 429**——`google-gemini-cli` 供應商觸發 429,但 `gquota` 顯示額度還有。這類是供應商端計量與實際限速不一致,等待或換 key 輪替較有效([原始 issue](https://github.com/NousResearch/hermes-agent/issues/10210) 一類的供應商端問題)。
- **z.ai 尖峰時段限速**——`zai/glm` 系列在尖峰時段對 Hermes 做速率限制,離峰或多 key 輪替可緩解。
- **HTTP 529 Overloaded**——跟 429 長得像但不同:529 是供應商**伺服器整體過載**(不是針對你限速)。重試同樣撞牆,解法一樣是等、或換供應商。MiniMax 就出現過反覆 529。

## 常見問題

### 我把 `api_max_retries` 調很高就好了?

不建議。持續 429 時,調高重試只是更用力撞同一道牆,還可能被供應商視為濫用。根因是配額,該做的是輪替 key 或升方案,不是狂重試[^2]。

### 429 和「呼叫靜默卡住」是同一件事嗎?

不是。卡住直到 stale timeout(`HERMES_API_CALL_STALE_TIMEOUT`,預設 90 秒)通常是連線或串流問題,不是限速[^2]。429 會明確回錯誤碼。

### 怎麼知道是 429 還是我 key 設錯?

key 設錯會回 401/403(未授權),不是 429。429 代表 key 是對的、只是太頻繁。key 沒設好的情況見 [API key not set](/troubleshoot/api-key-not-set/)。

## 下一步

- 多把 key 放哪、怎麼設 → [config.yaml 參考](/config/config-yaml-reference/)
- key 根本沒被讀到(401/403)→ [API key not set](/troubleshoot/api-key-not-set/)
- 對話太長被擋(context length)→ [context length exceeded](/troubleshoot/context-length-exceeded/)

[^1]: Nous Research, FAQ(Rate limiting / 429)— https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-27 存取)。429 =「已超過供應商速率上限」;建議動作:等待重試、升級方案、換模型或供應商、`hermes chat --provider <alternative>` 切換後端
[^2]: Nous Research, Configuration — https://hermes-agent.nousresearch.com/docs/user-guide/configuration(2026-07-27 存取)。`agent.api_max_retries` 預設 3(重試耗盡才啟動備援);`credential_pool_strategies.<provider>` 支援 fill_first / round_robin / least_used / random 多金鑰輪替;`HERMES_API_CALL_STALE_TIMEOUT` 預設 90 秒為非串流停滯偵測
