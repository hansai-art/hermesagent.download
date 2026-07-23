---
title: "OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）"
description: "用官方內建的 hermes claw migrate 把 OpenClaw 的記憶、SOUL.md、skills 與設定搬進 Hermes Agent：dry-run 預覽、模式選擇、搬不動的東西。"
date: 2026-07-23
subcategory: "openclaw"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md"
tags:
  - "openclaw"
status: "published"
---

Hermes 官方內建 OpenClaw 遷移指令：hermes claw migrate 會把 ~/.openclaw 的記憶、SOUL.md、command allowlist、skills 與相容設定搬進 Hermes，先用 --dry-run 預覽再執行。

**這頁適合誰**：正在從 OpenClaw 轉移到 Hermes Agent、想保留既有記憶與自訂內容的使用者。

## 步驟

1.  ### 先預覽會搬什麼
    
    dry-run 只報告不動手，會列出可搬、不可搬與會封存的項目。
    
    ```bash
    hermes claw migrate --dry-run
    ```
    
2.  ### 執行互動式完整遷移
    
    官方會搬：SOUL.md、MEMORY.md 與 USER.md（轉成 Hermes 記憶）、command allowlist、TELEGRAM\_ALLOWED\_USERS 等相容訊息設定、OpenClaw skills（放進 ~/.hermes/skills/openclaw-imports/）。
    
    ```bash
    hermes claw migrate
    ```
    
3.  ### 不想搬機密就用 preset
    
    user-data preset 會跳過 secrets；帶 --migrate-secrets 才會搬入允許清單內的機密（目前是 TELEGRAM\_BOT\_TOKEN）。
    
    ```bash
    hermes claw migrate --preset user-data
    ```
    
4.  ### 衝突與自訂來源
    
    既有檔案衝突可用 --overwrite 覆蓋；OpenClaw 目錄不在預設位置用 --source 指定。
    
    ```bash
    hermes claw migrate --overwrite
    hermes claw migrate --source /custom/path/.openclaw
    ```
    
5.  ### 第一次安裝的人不用手動跑
    
    官方說明：hermes setup 精靈會自動偵測 ~/.openclaw 並在設定前主動詢問是否遷移。
    
    ```bash
    hermes setup
    ```
    

## 完成後怎麼驗證

-   遷移結束會產出結構化報告：搬了什麼、衝突、跳過原因
-   Hermes 對話中能取用原本 OpenClaw 的記憶內容

## 常見問題

### 會不會搬我的 API key？

預設不搬 secrets。帶 --migrate-secrets 只會搬允許清單內的項目，官方目前清單是 TELEGRAM\_BOT\_TOKEN。

### 搬不過去的東西會消失嗎？

不會，官方流程會把沒有對應 Hermes 位置的非機密文件封存，並在報告裡列出跳過原因。

### OpenClaw 的 skills 能直接用嗎？

會被複製到 ~/.hermes/skills/openclaw-imports/，之後可逐一檢視啟用；不是每個都保證相容。

## 相關頁

-   [Hermes Agent macOS 下載與安裝教學](/install/macos/)
-   [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
-   [Hermes Agent Linux 下載與安裝教學](/install/linux/)
-   [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
-   [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
-   [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
-   [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
-   [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
-   [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
-   [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
-   [官方 Issue 精選問答](/issues/)
-   [學校解法卡](/guides/)

資料來源：[官方 openclaw-migration skill](https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/migration/openclaw-migration/SKILL.md)

最後檢查：2026-07-04
