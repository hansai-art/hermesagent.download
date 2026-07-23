---
title: "API key not set / API key 無效怎麼解"
description: "最常見的原因不是 key 打錯,是 key 跟供應商配錯了。三步驟排查,含 ~/.hermes/.env 的衝突設定。"
date: 2026-07-23
subcategory: "auth"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "auth"
  - "troubleshoot"
status: "published"
---

你確定 key 是對的——剛從供應商後台複製貼上的,一個字都沒錯。但 Hermes 就是說:

```
API key not set
```

或者更氣人的:key 明明填了,卻回你驗證失敗。

**最常見的原因不是 key 打錯,是 key 跟供應商配錯了**。OpenAI 的 key 不能用在 OpenRouter 上,反之亦然[^1]——兩邊的 key 長得很像,很容易貼錯格子。

## 第一步:看目前到底設了什麼

```bash
hermes config show
```

這會列出當前設定[^1]。看兩件事:

1. **供應商是不是你以為的那個**——如果你以為在用 OpenRouter,但這裡顯示 OpenAI,那 key 當然對不上
2. **key 有沒有真的存進去**

> 📝 **這一段缺實際輸出**:`hermes config show` 的實際欄位長什麼樣、key 是否會被遮罩,
> 我們手上沒有實機畫面。
> [幫我們補上](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/api-key-not-set.md)。

## 第二步:重新設定一次

最保險的做法是走互動式選單,它會確保供應商與 key 成對設定:

```bash
hermes model
```

選單會引導你選供應商、填 key[^1]。這比手動設定不容易出錯。

如果你確定供應商是哪個,也可以直接寫:

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

**注意 key 的前綴**——它通常會告訴你這是哪一家的 key:

| 前綴 | 供應商 |
|---|---|
| `sk-or-v1-` | OpenRouter |
| `sk-` | OpenAI |
| `sk-ant-` | Anthropic |

前綴跟你設定的供應商對不上,就是配錯了。

## 第三步:檢查 .env 有沒有衝突設定

這是最容易漏掉的一步。Hermes 會讀 `~/.hermes/.env`,如果那裡面有舊的、衝突的 key,可能會蓋掉你剛設的[^1]:

```bash
cat ~/.hermes/.env
```

**看到什麼**:一行行 `KEY=value` 格式的環境變數。如果裡面有你已經不用的舊 key(例如換供應商前留下的),把那幾行刪掉或註解掉。

## 驗證有沒有解決

```bash
hermes
```

進去隨便問一句話。**成功判準**:能正常回覆,不再出現 key 相關錯誤。

如果還是失敗,錯誤訊息這次通常會更具體(例如額度不足、模型名稱不存在),照著訊息處理即可——至少已經不是 key 沒設的問題了。

## 常見問題

### 更新之後設定就不見了?

先跑 `hermes config show` 確認現況,再用 `hermes model` 重新設定[^1]。

### 我不想自己管 key,有更簡單的方式嗎?

有。官方 Portal 一步到位,不用自己去各家申請 key:

```bash
hermes setup --portal
```

### 想改用別的模型?

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

或在對話中直接切換:`/model <名稱>`,跨供應商用 `/model provider:model`[^1]。

### 完全不想付錢?

用本地模型。`hermes model` 選 Custom endpoint,填入 Ollama 的位址。本地模型完全免費[^1]。設定細節見 [模型供應商與 API key 設定](/config/model-provider/)。

## 下一步

- 供應商怎麼選、怎麼省錢 → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到別的錯 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
