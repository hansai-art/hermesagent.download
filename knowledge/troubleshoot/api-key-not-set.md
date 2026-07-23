---
title: "API key not set / API key 無效怎麼解？"
description: "Hermes Agent 出現 API key not set 或 key 無效的官方解法：hermes model 重設、config show 檢查、key 與供應商對應。"
date: 2026-07-23
subcategory: "auth"
hermes_version: "*"
last_verified: 2026-07-04
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "auth"
status: "published"
---

看到 API key not set 就跑 hermes model 重新設定供應商，或直接 hermes config set OPENROUTER_API_KEY your_key；key 無效多半是填了不對應供應商的 key。

**這頁適合誰**：設定模型階段卡住、或換供應商後開始報錯的人。

## 步驟

1. ### 重新設定供應商

    ```bash
    hermes model
    ```

2. ### 或直接寫入 key

    ```bash
    hermes config set OPENROUTER_API_KEY your_key
    ```

3. ### 檢查目前設定

    ```bash
    hermes config show
    ```

4. ### 更新後設定不見了？

    官方文件提供 config 檢查與遷移指令。

    ```bash
    hermes config check
    hermes config migrate
    ```


## 完成後怎麼驗證

- hermes config show 顯示正確供應商
- 對話正常回覆

## 常見問題

### key 明明是對的還是失敗？

官方 FAQ 特別提醒：key 必須對應供應商，OpenAI 的 key 不能用在 OpenRouter，反之亦然。

### 模型顯示不可用？

用 hermes model 列出可用模型，或明確指定：hermes config set HERMES_MODEL anthropic/claude-opus-4.7。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
- [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
- [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
- [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
- [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
- [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
- [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
- [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
- [官方 Issue 精選問答](/issues/)
- [學校解法卡](/guides/)

資料來源：[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)．[官方安裝文件](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

最後檢查：2026-07-04
