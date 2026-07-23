---
title: "Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）"
description: "Windows 安裝 Hermes Agent 的三條路：官方桌面版安裝器、原生 PowerShell 指令、WSL2。含各自適用情境與常見錯誤。"
date: 2026-07-23
subcategory: "windows"
hermes_version: "*"
last_verified: 2026-07-04
upstream_refs:
  - "https://hermes-agent.nousresearch.com/install.ps1"
  - "https://hermes-agent.nousresearch.com/install.sh"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "windows"
status: "published"
---

Windows 使用者有三條官方路徑：最簡單是下載 Desktop 安裝器；命令列派用官方 PowerShell 一行指令；想要完整 Linux 工具鏈則裝在 WSL2 裡。

**這頁適合誰**：Windows 10 / 11 使用者。不確定選哪條路的話：新手選 Desktop，工程師選 WSL2。

## 步驟

1. ### 方式一：官方桌面版（推薦新手）

    到官方網站下載 Hermes Desktop 安裝器並執行，相依套件全部自動處理。

2. ### 方式二：原生 PowerShell

    打開 PowerShell，執行官方原生安裝指令。

    ```text
    iex (irm https://hermes-agent.nousresearch.com/install.ps1)
    ```

3. ### 方式三：WSL2（完整 Linux 環境）

    在 WSL2 的 Linux shell 裡使用與 Linux 相同的官方指令。需要完整終端機工具與腳本支援的進階用法建議走這條，詳見 WSL2 完整教學。

    ```bash
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
    ```

4. ### 重新載入 shell 並啟動

    安裝完成後重載 shell 或開新視窗，輸入 hermes 開始。

    ```bash
    hermes
    ```

5. ### 設定模型供應商

    第一次啟動選擇 LLM 供應商並填 API key。

    ```bash
    hermes model
    ```


## 完成後怎麼驗證

- hermes 指令能進入對話介面
- hermes doctor 全部通過

## 常見問題

### WSL2 跑 gateway 常斷線？

官方 FAQ 指出 systemd 在 WSL 裡不可靠，建議改用前景模式 hermes gateway run，或用 tmux 保持常駐：tmux new -s hermes 'hermes gateway run'。

### WSL2 裡的 Hermes 要控制 Windows 的 Chrome？

官方建議走 MCP bridge：在 WSL2 跑 Hermes，把 chrome-devtools-mcp 設成 MCP server，比 /browser connect 可靠。

### 該選原生 PowerShell 還是 WSL2？

只是要用 agent 對話與基本自動化，原生 PowerShell 或 Desktop 就夠；要跑大量 Linux 工具鏈與腳本的進階工作流，官方社群普遍建議 WSL2。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
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

資料來源：[官方安裝文件](https://hermes-agent.nousresearch.com/docs/getting-started/installation)．[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)

最後檢查：2026-07-04
