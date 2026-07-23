---
title: "Telegram 接 Hermes Agent 常見坑與解法"
description: "Hermes Agent 接 Telegram 的兩個官方已知坑：斜線指令 100 上限、WSL 下 gateway 斷線，含官方 config 解法。"
date: 2026-07-23
subcategory: "telegram"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "telegram"
status: "published"
---

Telegram 整合最常見兩個坑：Telegram 有 100 個斜線指令上限（用 skills.platform\_disabled 停用不需要的 skill），以及 WSL 下 gateway 斷線（改用 hermes gateway run 前景模式或 tmux）。

**這頁適合誰**：把 Hermes 接上 Telegram bot 後遇到指令消失或斷線的人。

## 步驟

1.  ### 坑一：斜線指令超過 100 個
    
    Telegram 平台限制 100 個指令。官方解法：在 config.yaml 停用該平台不需要的 skills，改完重啟 gateway。
    
    ```yaml
    skills:
      platform_disabled:
        telegram: [skill-a, skill-b]
    ```
    
2.  ### 坑二：WSL 下 gateway 一直斷
    
    官方 FAQ：systemd 在 WSL 不可靠，改用前景模式或 tmux 常駐。
    
    ```bash
    hermes gateway run
    # 或
    tmux new -s hermes 'hermes gateway run'
    ```
    
3.  ### 多人共用要設授權
    
    官方訊息閘道支援 allowlist 與 DM 配對，在 config.yaml 的 gateway 設定授權模式。
    

## 完成後怎麼驗證

-   Telegram 指令選單正常出現
-   gateway 重啟後長時間不斷線

## 常見問題

### 從 OpenClaw 搬過來，Telegram 允許名單要重設嗎？

官方遷移工具會搬 TELEGRAM\_ALLOWED\_USERS 等相容設定；帶 --migrate-secrets 也會搬 TELEGRAM\_BOT\_TOKEN。見 OpenClaw 搬家教學。

## 相關頁

-   [Hermes Agent macOS 下載與安裝教學](/install/macos/)
-   [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
-   [Hermes Agent Linux 下載與安裝教學](/install/linux/)
-   [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
-   [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
-   [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
-   [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
-   [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
-   [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
-   [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
-   [官方 Issue 精選問答](/issues/)
-   [學校解法卡](/guides/)

資料來源：[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)

最後檢查：2026-07-04
