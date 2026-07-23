---
title: "context length exceeded 怎麼解"
description: "先用 /compress 救回當前對話,再從設定根治。本地模型使用者特別容易踩到——原因跟你想的不一樣。"
date: 2026-07-23
subcategory: "runtime"
hermes_version: ">=2026.5"
last_verified: 2026-07-04
human_reviewed: false
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "runtime"
  - "troubleshoot"
status: "published"
---

你正在做一件事做到一半——agent 讀了幾個檔案、跑了幾個工具、來回討論了二十輪——然後它突然說:

```
context length exceeded
```

對話卡住,而你不想從頭再來一次。

## 先救火:壓縮當前對話

在對話中直接輸入:

```
/compress
```

這會把先前的對話歷史摘要成較短的版本,騰出空間繼續[^1]。

**成功判準**:能繼續對話,不再噴 context 錯誤。摘要會保留脈絡,但細節可能被壓掉——如果後面發現它「忘記」了某個細節,重新講一次即可。

## 看看到底用掉多少

```
/usage
```

顯示當前的 token 用量[^1]。這能告訴你是快要滿了,還是離上限還遠(如果離上限還遠卻報錯,那多半是下面那個設定問題)。

## 根治:在設定檔明確指定 context 長度

這一步對**本地模型或自架 endpoint 的使用者特別重要**。

Hermes 會嘗試偵測模型的 context 上限,但接自架服務時常常抓不準——它可能以為你的模型只有 8K,實際上有 128K,於是提早就報錯。

編輯 `~/.hermes/config.yaml`:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

`context_length` 要填**你的伺服器實際能支援的數字**,不是模型理論上的最大值[^1]。填太大會在真的超過時直接失敗,填太小則浪費。

**怎麼知道該填多少**:看你的推論服務(Ollama、vLLM 等)啟動時設定的 context 長度。以 Ollama 為例,那是模型 Modelfile 裡的 `num_ctx`。

> 📝 **待補**:各家本地推論服務查 context 上限的具體指令,我們還沒整理。
> 你如果跑過 Ollama / vLLM / LM Studio,
> [幫我們補上這一段](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/troubleshoot/context-length-exceeded.md)。

## 長期習慣:讓對話不要無限長

`/compress` 是急救,不是常態解。幾個減少撞牆機率的做法:

**做完一件事就開新對話**。Hermes 的記憶系統會跨 session 保留重要資訊,所以開新對話不等於從零開始——它記得你是誰、專案長什麼樣。持續在同一個 session 裡堆疊,反而是把大量已經處理完的細節一直帶著走。

**大檔案別整個丟進去**。讓 agent 用工具去讀特定段落,比你貼一整份檔案有效率。

**注意工具輸出**。一次 `ls -R` 或一份完整的 log 就可能吃掉大量 token,而那些內容多半用完就沒價值了。

## 常見問題

### 為什麼有時候剛開對話就報錯?

多半是設定的 `context_length` 大於伺服器實際能力,第一次請求就超過。把設定值調小試試。

### 換成 context 更大的模型能解決嗎?

能拖延,但不能根治——長對話終究會撞牆。搭配 `/compress` 與適時開新對話才是穩定的做法。

### 壓縮之後 agent 忘記事情了怎麼辦?

正常,摘要必然會損失細節。重新講一次關鍵資訊即可;真正重要的東西應該讓它寫進記憶系統,而不是留在對話裡。

## 下一步

- 設定模型與本地 endpoint → [模型供應商與 API key 設定](/config/model-provider/)
- 遇到別的錯 → [疑難排解總覽](/troubleshoot/overview/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
