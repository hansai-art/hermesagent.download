---
title: "設定模型供應商和 API key:新手一步步教學"
description: "Hermes 裝好還不能用,得先教它去哪裡借 AI 大腦。這篇帶你選一家、填好金鑰,還教你一招很有感的省錢設定。"
date: 2026-07-23
subcategory: "provider"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "provider"
  - "config"
status: "published"
---

Hermes Agent 裝好之後,其實還不能馬上用。

為什麼?因為它本身沒有內建 AI 大腦(也就是「模型」,model,就是實際幫你思考、回答的那個 AI)。Hermes 比較像「助理的身體」:動作它都會,但你要先幫它接上一顆大腦。這篇就是教你怎麼接。

這一步的正式說法,叫設定「模型供應商」(provider,就是提供 AI 模型的公司或服務,例如 OpenAI、Google)。

它會決定兩件事:

- 你用起來順不順。
- 你每個月付多少錢。

而且差距可以很大。同樣的工作量,設定得好跟設定得差,花的錢可以差十倍以上。所以花幾分鐘把它設好,很值得。

下面給你幾條路,從最省事到最進階。挑一條做就好。

## 最省事的路:用官方 Portal 一次搞定

如果你「不想一家一家去申請帳號、拿金鑰」,選這條。

在終端機(就是那個黑底白字、可以打指令的視窗)輸入這一行:

```bash
hermes setup --portal
```

這會透過 Nous Portal(官方的模型中轉服務)幫你一次接上 300 多個模型,設定一次就好[^1]。

> 小知識:API key(金鑰)是一串像密碼的字,用來證明「這次是你在用」,費用也算在你頭上。用 Portal 的好處,就是你不必自己跑去各家申請這串金鑰。

## 標準的路:用互動式選單一步步選

如果你想自己挑一家來用:

```bash
hermes model
```

這會打開一個互動式選單(它會一項一項問你,你用方向鍵移動、按 Enter 選)。你在裡面選一家供應商,然後貼上那家給你的 API key[^1]。

官方支援這些:OpenRouter、OpenAI、Anthropic Claude、Google Gemini,還有 Ollama、vLLM 這類「本地模型」(跑在你自己電腦上的模型,後面會講)。

**怎麼確認成功了**:選單一路走到底沒有跳出錯誤,然後執行下面這行,看得到你剛剛選的那家供應商,就成功了。

```bash
hermes config show
```

## 各家怎麼挑

不知道選哪家?看這張表對號入座就好:

| 供應商 | 適合誰 |
|---|---|
| **Nous Portal** | 不想管金鑰、想一次拿到很多種模型的人 |
| **OpenRouter** | 想在多家模型之間切換、比價,用一把金鑰就通吃的人 |
| **OpenAI / Anthropic / Google** | 本來就有帳號,或特別依賴某一家模型的人 |
| **Ollama / vLLM(本地)** | 完全不想付錢,或資料不能離開自己電腦的人 |

## 進階:直接把設定寫進去,跳過選單

如果你已經很確定要用哪一家,可以不開選單,直接一行指令搞定。

下面這行,是把 OpenRouter 的金鑰存進去(`sk-or-v1-xxxx` 換成你自己的金鑰):

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

(`OPENROUTER_API_KEY` 這種全大寫的名字,叫「環境變數」,你可以想成「一個有名字的設定格子」,Hermes 會去這個格子讀你的金鑰。)

想指定要用哪個特定模型:

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

也可以在跟 Hermes 聊天的過程中臨時換模型,不用重開[^1]:

```text
/model <模型名稱>
/model provider:model
```

## 接本地模型(完全免費)

「本地模型」就是跑在你自己電腦上的 AI,不經過別人的伺服器。好處是免費、資料不外流;代價是要你的電腦夠力。

做法:執行 `hermes model`,在選單裡選 **Custom endpoint**(自訂連線位址),然後填入本地服務的網址。用 Ollama 的話,通常是這個:

```text
http://localhost:11434/v1
```

**很重要**:接本地模型時,一定要在設定檔裡「明白寫出 context 長度」。

(context 是「上下文」,你可以想成模型一次能記住的對話量;它有一個上限。)

如果不寫,Hermes 可能會猜錯這個上限,結果對話還沒聊幾句,就冒出這個錯誤字串:`context length exceeded`(意思是「超過上下文長度了」)。

打開設定檔 `~/.hermes/config.yaml` 來編輯。

(這個檔叫 config.yaml,是 Hermes 的設定檔;YAML 是一種「靠縮排排版」的設定寫法,所以每一層前面的空格不能亂縮。)

填成這樣:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

這裡的 `context_length` 要填**你的伺服器實際撐得住的數字**[^1],不是模型宣傳上的最大值。以 Ollama 來說,這個數字就是 Modelfile(Ollama 的模型設定檔)裡的 `num_ctx`。

## 省錢絕招:讓「小助手」跑便宜模型

這招最有感,但很多人不知道。

Hermes 遇到比較大的工作時,會自己派出一些「小助手」去分頭做事。這些小助手的正式名字叫子代理(subagent)。

重點來了:這些小助手做的多半是雜事,根本用不到最強、最貴的模型。但預設情況下,它們會跟著用你設定的主模型:等於「用旗艦等級的價格去做打雜的活」,很浪費。

解法:在設定檔 `~/.hermes/config.yaml` 裡的 `delegation`(委派)區塊,單獨指定一個便宜模型給這些小助手用[^1]:

```yaml
delegation:
  model: google/gemini-3-flash-preview
  provider: openrouter
```

這樣一來:你自己在對話的主線,還是用高品質的好模型;背後打雜的小助手,走便宜模型。兩邊分開,帳單就下來了。

> 📝 **待補實測數據**:實際能省多少,要看你怎麼用。
> 如果你有前後對比過帳單,[幫我們補上真實數字](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/config/model-provider.md):
> 這種「只有真的用過才知道」的資訊,正是這個站最缺的。

## 最後:確認設定有生效

先看一眼目前的設定:

```bash
hermes config show
```

**看什麼**:上面顯示的供應商和模型,是不是你剛剛設定的那一個。是,就對了。

然後實際跑一次 Hermes:

```bash
hermes
```

隨便打一句話問它。它能正常回你,就代表整條路都通了,恭喜。

## 常見問題

### 到底要花多少錢?

Hermes Agent 這個程式本身是免費的開源軟體(採 MIT 授權,一種很寬鬆、可自由使用的授權)。你要付的,只有你選的那家供應商的 API 費用[^1]。如果你用的是本地模型,那就一毛都不用付。

### 金鑰填了,還是報錯?

最常見的原因是:金鑰和供應商配錯家了。比方說,OpenAI 的金鑰不能拿去用在 OpenRouter[^1]。詳細怎麼查,看這篇 [API key not set 怎麼解](/troubleshoot/api-key-not-set/)。

### 聊到一半想換模型?

用 `/model <名稱>` 就能換;要跨到別家供應商,用 `/model provider:model`[^1]。都不需要重開。

### 出現 context length exceeded?

先用 `/compress` 把目前的對話壓縮一下(把前面的內容濃縮,騰出空間),再用 `/usage` 看看目前用了多少。長期的根本解法,是在 `config.yaml` 裡明白設定 `context_length`[^1]。詳見 [context length exceeded 怎麼解](/troubleshoot/context-length-exceeded/)。

## 下一步

- 想知道 token(可以想成「AI 計費用的字數單位」)實際花在哪 → [hermes insights:搞清楚 token 花在哪](/config/insights-token-usage/)
- 還沒安裝 → [安裝部署](/install/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 想看它能做什麼 → [技能目錄](/skills/catalog/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-23 存取)
