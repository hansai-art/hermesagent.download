---
title: "Hermes Agent Linux 下載與安裝教學"
description: "在 Linux 用官方一行指令安裝 Hermes Agent：前置套件、安裝位置、service user 部署與驗證步驟。"
date: 2026-07-23
subcategory: "linux"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/install.sh"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
tags:
  - "linux"
status: "published"
---

Linux 安裝 Hermes Agent 只要一行官方指令：curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash，前置只需要 git、curl 與 xz-utils。

**這頁適合誰**：Linux 桌機或伺服器使用者，包含要在 VPS 上長駐 agent 的人。

## 步驟

1. ### 安裝前置套件

    Debian / Ubuntu 先確認 curl 與 xz-utils 存在；要用桌面版另需 build-essential。

    ```bash
    sudo apt install curl xz-utils
    git --version
    ```

2. ### 執行官方安裝指令

    安裝器自動處理 Python 3.11、Node.js v22、ripgrep、ffmpeg。

    ```bash
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
    ```

3. ### 重新載入 shell 並啟動

    重載 shell 設定後啟動。

    ```bash
    source ~/.bashrc
    hermes
    ```

4. ### 設定模型供應商

    選擇 LLM 供應商並填 API key。

    ```bash
    hermes model
    ```

5. ### （伺服器）service user 部署

    官方文件：先用管理者身分裝 Playwright 相依，再以 service user 執行安裝器；不需要瀏覽器可加 --skip-browser。

    ```bash
    sudo npx playwright install-deps chromium
    ```


## 完成後怎麼驗證

- hermes 能進入對話介面
- hermes doctor 全部通過

## 常見問題

### 裝在哪裡？

預設 per-user 安裝在 ~/.hermes/hermes-agent/；root 模式會裝到 /usr/local/lib/hermes-agent/。

### Python 版本太舊？

Hermes 需要 Python 3.11 以上，但官方安裝器會自動處理；若自管環境報錯，用 python3 --version 檢查後以套件管理器升級。

### Android 手機能裝嗎？

可以，官方支援 Termux，用與 Linux 相同的一行指令。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
- [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
- [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
- [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
- [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
- [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
- [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
- [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
- [官方 Issue 精選問答](/issues/)
- [學校解法卡](/guides/)

資料來源：[官方安裝文件](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

最後檢查：2026-07-04
