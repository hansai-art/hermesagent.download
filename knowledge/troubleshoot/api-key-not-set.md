---
title: '看到「API key not set」或說 key 無效?這樣一步步查'
description: '最常見的原因其實不是 key 打錯,而是 key 跟供應商配錯對了。跟著三步驟慢慢查,包含最容易漏掉的 ~/.hermes/.env 衝突設定。'
date: 2026-07-23
subcategory: 'auth'
hermes_version: '>=2026.5'
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - 'https://hermes-agent.nousresearch.com/docs/reference/faq'
  - 'https://hermes-agent.nousresearch.com/docs/configuration'
tags:
  - 'auth'
  - 'troubleshoot'
status: 'published'
---

先解釋一個詞。這篇一直會講到 **API key**(以下就叫「key」):它是一串像密碼的字,讓 Hermes 能用你在某家 AI 公司開的帳號。還有一個詞是**供應商**(provider,就是提供 AI 模型的公司,例如 OpenAI、OpenRouter、Anthropic)。你要先在某家供應商那邊申請一把 key,再把它填給 Hermes。

好,回到問題。你很確定 key 是對的:剛從供應商的網站後台複製貼上,一個字都沒漏。但 Hermes 就是跟你說:

```text
API key not set
```

或者更讓人火大的:key 明明填了,它卻回你「驗證失敗」。

別急,先深呼吸。**最常見的原因其實不是 key 打錯,而是 key 跟供應商配錯對了。** 打個比方:每家供應商的 key 就像不同銀行的提款卡,長得很像,但 OpenAI 的卡不能插進 OpenRouter 的機器,反過來也一樣[^1]。兩邊的 key 外觀又很接近,一不小心就貼到錯的格子裡。

下面三步,一步一步來就好。

## 第一步:先看看現在到底設了什麼

在終端機(就是你打指令的那個黑底或白底視窗)輸入:

```bash
hermes config show
```

這個指令會把 Hermes 目前的設定列出來給你看[^1]。你只要盯著兩件事:

1. **供應商是不是你以為的那一家**:如果你心裡想的是 OpenRouter,但這裡顯示的是 OpenAI,那 key 當然對不上，你拿 OpenRouter 的 key 去餵給 OpenAI,它當然不認。
2. **key 到底有沒有真的存進去**:有時候你以為填好了,其實根本沒存成功。

> 📝 **這一段還缺實際畫面**:`hermes config show` 印出來的欄位長什麼樣、key 會不會被打星號遮起來,
> 我們手邊沒有真的跑出來的截圖。
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/api-key-not-set.md)。

## 第二步:乾脆重新設定一次

最不容易出錯的方法,是走「互動式選單」(就是它會一步步問你、給你選項的那種畫面,你只要跟著選就好):

```bash
hermes model
```

這個選單會帶著你先選供應商、再填 key[^1]。因為供應商和 key 是它同一次幫你配好的,所以幾乎不會配錯。比起自己手動一個個打,這樣穩多了。

如果你很清楚自己要用哪一家,也可以直接一行指令設定好。例如:

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

**這裡有個小訣竅:看 key 開頭的那幾個字(前綴)。** key 的開頭通常會告訴你它是哪一家的:

| 開頭長這樣  | 就是這家供應商 |
| ----------- | -------------- |
| `sk-or-v1-` | OpenRouter     |
| `sk-`       | OpenAI         |
| `sk-ant-`   | Anthropic      |

如果你的 key 開頭,跟你設定的供應商對不起來(比方說你設 OpenAI,key 卻是 `sk-or-v1-` 開頭),那就是配錯了。

## 第三步:檢查 .env 檔裡有沒有「打架」的舊設定

這一步最容易被忽略,但常常就是它在搞鬼。

Hermes 開機時會去讀一個叫 `~/.hermes/.env` 的檔案(`.env` 是一種純文字檔,裡面一行行寫著各種設定;`~` 代表你的個人資料夾)。如果這個檔案裡藏著一把舊的、對不上的 key,它可能會偷偷蓋掉你剛剛設好的那把[^1]。

打開來看看裡面有什麼:

```bash
cat ~/.hermes/.env
```

**你會看到什麼**:一行行 `KEY=value` 這種格式的東西(這叫「環境變數」,你可以想成是給程式看的一張張小便利貼,每張寫著「這個設定=這個值」)。如果裡面有你已經不用的舊 key(例如你之前換過供應商,舊的忘了刪),就把那幾行整行刪掉,或在行首加個 `#` 把它註解掉(等於叫程式先別理這行)。

## 怎麼確認已經解決了

打開 Hermes:

```bash
hermes
```

進去之後隨便問它一句話。**只要它能正常回你話、不再跳出跟 key 有關的錯誤,就代表成功了。**

如果還是失敗也別灰心。這次的錯誤訊息通常會講得更具體(例如「額度不足」或「找不到這個模型名稱」),照著新的訊息去處理就好。至少你已經跨過「key 沒設好」這一關了。

## 常見問題

### 更新完 Hermes,設定就不見了?

先跑 `hermes config show` 看看現在剩下什麼,再用 `hermes model` 重新設定一次就好[^1]。

### 我懶得自己一家家去申請 key,有沒有更省事的方法?

有。官方的 Portal(入口服務)可以一次搞定,你不用自己跑去各家供應商申請 key:

```bash
hermes setup --portal
```

### 我想換一個 AI 模型來用?

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

或者在跟 Hermes 對話的當下直接切換,輸入:`/model <模型名稱>`。如果要換到別家供應商的模型,就寫成 `/model provider:model` 這種格式[^1]。

### 我完全不想花錢,可以嗎?

可以,用「本地模型」就好，意思是讓 AI 直接在你自己的電腦上跑,不透過任何付費供應商。做法是執行 `hermes model`,選 Custom endpoint(自訂連線位址),再填入 Ollama 的位址就行(Ollama 是一套免費軟體,讓你在自己電腦上跑 AI 模型)。本地模型完全免費[^1]。詳細怎麼設,看這篇 [模型供應商與 API key 設定](/config/model-provider/)。

## 下一步

- 想知道供應商怎麼選、怎麼省錢 → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到別的錯誤 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ:https://hermes-agent.nousresearch.com/docs/reference/faq (2026-07-23 存取)

[^2]: Nous Research, Configuration:https://hermes-agent.nousresearch.com/docs/configuration (2026-08-30 存取)
