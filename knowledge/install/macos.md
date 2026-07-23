---
title: "Hermes Agent macOS 下載與安裝教學"
description: "在 macOS 下載安裝 Hermes Agent 的兩種官方方式：桌面版安裝器與一行終端機指令，含驗證步驟與常見錯誤。"
date: 2026-07-23
subcategory: "macos"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/install.sh"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "macos"
status: "published"
---

macOS 安裝 Hermes Agent 最快的方式：到官方網站下載 Desktop 安裝器直接執行；偏好終端機的人用一行官方安裝指令即可。

**這頁適合誰**：第一次在 Mac 上安裝 Hermes Agent 的使用者，不需要事先裝 Python 或 Node.js。

## 步驟

1.  ### 方式一：下載官方桌面版（推薦新手）
    
    到官方網站下載 Hermes Desktop 安裝器並執行。安裝器會自動處理 Python 3.11、Node.js v22、ripgrep、ffmpeg 等相依套件，不需要手動安裝。
    
2.  ### 方式二：終端機一行指令
    
    打開「終端機」，貼上官方安裝指令執行。
    
    ```bash
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
    ```
    
3.  ### 前置需求檢查
    
    唯一需要事先存在的是 Git。用以下指令確認；macOS 若未安裝，系統會提示安裝 Xcode Command Line Tools。
    
    ```bash
    git --version
    ```
    
4.  ### 重新載入 shell 並啟動
    
    安裝完成後重新載入 shell 設定，再輸入 hermes 開始使用。
    
    ```bash
    source ~/.zshrc
    hermes
    ```
    
5.  ### 設定模型供應商
    
    第一次啟動要選擇 LLM 供應商並填 API key。
    
    ```bash
    hermes model
    ```
    

## 完成後怎麼驗證

-   終端機輸入 hermes 能進入對話介面
-   hermes doctor 全部項目通過

## 常見問題

### 裝完輸入 hermes 顯示 command not found？

shell 還沒重新載入 PATH。執行 source ~/.zshrc（zsh）或 source ~/.bashrc（bash），或直接開新的終端機視窗。詳見「hermes: command not found」排解頁。

### 需要先自己裝 Python 嗎？

不用。官方安裝器會自動處理 Python 3.11、Node.js v22、ripgrep 與 ffmpeg。

### 裝在哪個目錄？

預設安裝在使用者目錄 ~/.hermes/hermes-agent/。

## 相關頁

-   [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
-   [Hermes Agent Linux 下載與安裝教學](/install/linux/)
-   [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
-   [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
-   [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
-   [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
-   [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
-   [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
-   [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
-   [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
-   [官方 Issue 精選問答](/issues/)
-   [學校解法卡](/guides/)

資料來源：[官方安裝文件](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

最後檢查：2026-07-04
