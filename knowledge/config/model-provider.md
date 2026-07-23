---
title: "Hermes Agent 模型供應商與 API key 設定教學"
description: "hermes model 指令完整教學：OpenRouter / OpenAI / Anthropic / Gemini / Ollama 本地模型設定、API key 錯誤排解、省錢技巧。"
date: 2026-07-23
subcategory: "provider"
hermes_version: "*"
last_verified: 2026-07-04
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "provider"
status: "published"
---

Hermes Agent 支援任何 OpenAI 相容 API：輸入 hermes model 進互動式選單選供應商並填 API key；要用本地模型就選 Custom endpoint 填 Ollama 位址。

**這頁適合誰**：剛裝好 Hermes、卡在「要選哪個模型供應商」與「API key 怎麼填」的人。

## 步驟

1. ### 打開供應商選單

    官方支援 OpenRouter、OpenAI、Anthropic Claude、Google Gemini，以及 Ollama / vLLM 等本地模型。

    ```bash
    hermes model
    ```

2. ### 或用官方 Portal

    hermes setup --portal 可透過 Nous Portal 使用 300+ 模型。

    ```bash
    hermes setup --portal
    ```

3. ### 直接設定 key（進階）

    也可以用 config 指令直接寫入。

    ```bash
    hermes config set OPENROUTER_API_KEY your_key
    ```

4. ### 本地模型（Ollama 範例）

    跑 hermes model 選 Custom endpoint，填入本地位址，並把 context length 設成伺服器實際能力。

    ```yaml
    http://localhost:11434/v1
    ```

5. ### 指定特定模型

    ```bash
    hermes config set HERMES_MODEL anthropic/claude-opus-4.7
    ```


## 完成後怎麼驗證

- hermes config show 看得到供應商設定
- 對話能正常回覆，不再出現 API key 錯誤

## 常見問題

### API key 填了還是報錯？

官方 FAQ：先 hermes config show 確認設定，再跑 hermes model 重新設定。注意 key 要對應供應商：OpenAI 的 key 不能用在 OpenRouter。

### 跑 Hermes 到底要花多少錢？

Hermes Agent 本體免費開源（MIT），你只付所選供應商的 LLM API 費用。社群實測換供應商可以差一個數量級（見高手經驗頁的成本案例）。

### 可以讓子代理用便宜模型嗎？

可以，官方 FAQ：在 config.yaml 的 delegation 區塊設定，例如 model: google/gemini-3-flash-preview 配 provider: openrouter，subagent 會自動用該模型。

### 出現 context length exceeded？

用 /compress 壓縮 session，用 /usage 看用量；也可在 config.yaml 的 model.context_length 明確設定（如 131072）。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
- [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
- [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
- [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
- [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
- [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
- [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
- [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
- [官方 Issue 精選問答](/issues/)
- [學校解法卡](/guides/)

資料來源：[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)．[官方安裝文件](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

最後檢查：2026-07-04
