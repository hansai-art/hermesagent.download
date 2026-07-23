---
title: "context length exceeded 怎麼解？"
description: "Hermes Agent 出現 context length exceeded 的官方解法：/compress 壓縮 session、/usage 檢查用量、config.yaml 明確設定 context_length。"
date: 2026-07-23
subcategory: "runtime"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "runtime"
status: "published"
---

context length exceeded 的官方解法：先用 /compress 壓縮目前 session，用 /usage 看用量；長期解法是在 config.yaml 的 model.context_length 明確設定模型實際上限。

**這頁適合誰**：長對話或大量工具輸出後撞到 context 上限的人。

## 步驟

1. ### 壓縮目前 session

    在對話中輸入斜線指令。

    ```text
    /compress
    ```

2. ### 檢查用量與偵測到的上限

    啟動時會顯示偵測到的 context 上限，對話中可查。

    ```text
    /usage
    ```

3. ### 在 config.yaml 明確設定

    特別是自架 / 本地模型，要把 context_length 設成伺服器實際能力。

    ```yaml
    model:
      context_length: 131072
    ```


## 完成後怎麼驗證

- 壓縮後對話恢復正常
- 啟動訊息顯示的 context 上限符合模型實際規格

## 常見問題

### 本地模型特別容易撞到？

官方 FAQ 提醒用 Custom endpoint（如 Ollama）時要把 context length 設成伺服器實際能力，偵測值不一定正確。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
- [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
- [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
- [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
- [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
- [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
- [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
- [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
- [官方 Issue 精選問答](/issues/)
- [學校解法卡](/guides/)

資料來源：[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)

最後檢查：2026-07-04
