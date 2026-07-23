---
title: "模型供應商與 API key 設定"
description: "選哪家、怎麼填 key、怎麼省錢、怎麼接本地模型。含讓子代理跑便宜模型的設定——這招最有感。"
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

Hermes Agent 裝好之後還不能用——它不自帶模型,你得先告訴它去哪裡取得推論能力。

這一步會決定兩件事:**體驗好不好**,以及**每個月付多少錢**。而這兩件事的差距可以很大——同樣的工作量,設定得好跟設定得差,成本可以差一個數量級。

## 最快的路:官方 Portal

如果你不想一家一家去申請 API key:

```bash
hermes setup --portal
```

透過 Nous Portal 可以使用 300 多個模型,一次設定完成[^1]。

## 標準路:互動式選單

```bash
hermes model
```

進入互動式選單,選供應商並填入 API key[^1]。官方支援 OpenRouter、OpenAI、Anthropic Claude、Google Gemini,以及 Ollama、vLLM 等本地模型。

**成功判準**:選單流程走完沒報錯,接著 `hermes config show` 能看到你選的供應商。

## 各家怎麼選

| 供應商 | 適合誰 |
|---|---|
| **Nous Portal** | 不想管 key、想一次拿到多種模型 |
| **OpenRouter** | 想在多家模型間切換比價,一把 key 通用 |
| **OpenAI / Anthropic / Google** | 已經有帳號,或特別依賴某家的模型 |
| **Ollama / vLLM(本地)** | 完全不想付錢,或資料不能離開自己的機器 |

## 直接寫入設定(進階)

確定供應商時可以跳過選單:

```bash
hermes config set OPENROUTER_API_KEY sk-or-v1-xxxx
```

指定特定模型:

```bash
hermes config set HERMES_MODEL anthropic/claude-opus-4.7
```

也可以在對話中臨時切換,不必重啟[^1]:

```
/model <模型名稱>
/model provider:model
```

## 接本地模型(完全免費)

跑 `hermes model`,選 **Custom endpoint**,填入本地服務位址。以 Ollama 為例:

```
http://localhost:11434/v1
```

**重要**:接本地模型時要在設定檔明確指定 context 長度,否則 Hermes 可能抓錯上限,導致對話還沒多長就報 `context length exceeded`。

編輯 `~/.hermes/config.yaml`:

```yaml
model:
  default: your-model-name
  context_length: 131072
```

`context_length` 要填**伺服器實際能支援的數字**[^1],不是模型理論最大值。以 Ollama 來說,那是 Modelfile 裡的 `num_ctx`。

## 省錢:讓子代理跑便宜模型

這招最有感,但很多人不知道。

Hermes 會派出子代理(subagent)處理平行工作。這些子任務多半不需要最強的模型——但預設會用你設定的主模型,等於用旗艦模型的價格做雜事。

在 `~/.hermes/config.yaml` 的 `delegation` 區塊指定子代理專用的便宜模型[^1]:

```yaml
delegation:
  model: google/gemini-3-flash-preview
  provider: openrouter
```

主對話維持高品質,子任務走便宜模型。

> 📝 **待補實測數據**:實際能省多少,取決於你的使用模式。
> 如果你前後對比過帳單,[幫我們補上真實數字](https://github.com/hansai-art/hermesagent.download/edit/main/knowledge/config/model-provider.md)——
> 這種只有實際用過才知道的資訊,正是這個站最缺的。

## 確認設定生效

```bash
hermes config show
```

**看什麼**:供應商與模型是不是你設定的那個。

接著實際跑一次:

```bash
hermes
```

隨便問一句話,能正常回覆代表整條路通了。

## 常見問題

### 到底要花多少錢?

Hermes Agent 本體是 MIT 授權的開源軟體,**免費**。你只付所選供應商的 API 費用[^1]。用本地模型則完全不花錢。

### API key 填了還是報錯?

最常見的原因是 key 跟供應商配錯——OpenAI 的 key 不能用在 OpenRouter[^1]。詳細排查見 [API key not set 怎麼解](/troubleshoot/api-key-not-set/)。

### 對話中途想換模型?

用 `/model <名稱>`,跨供應商用 `/model provider:model`[^1],不需要重啟。

### 出現 context length exceeded?

先 `/compress` 壓縮當前對話,`/usage` 看用量;長期解法是在 `config.yaml` 明確設定 `context_length`[^1]。詳見 [context length exceeded 怎麼解](/troubleshoot/context-length-exceeded/)。

## 下一步

- 還沒安裝 → [安裝部署](/install/)
- 從 OpenClaw 搬過來 → [遷移指南](/migrate/migrate-from-openclaw/)
- 想看它能做什麼 → [技能目錄](/skills/catalog/)

[^1]: Nous Research, FAQ — https://hermes-agent.nousresearch.com/docs/reference/faq(2026-07-23 存取)
