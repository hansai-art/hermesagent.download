---
title: "Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）"
description: "在 Windows 的 WSL2 安裝 Hermes Agent：WSL2 準備、官方安裝指令、gateway 常駐、連 Windows Chrome 的官方建議。"
date: 2026-07-23
subcategory: "windows"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/install.sh"
  - "https://hermes-agent.nousresearch.com/docs/getting-started/installation"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "windows"
status: "published"
---

在 WSL2 安裝 Hermes Agent 與 Linux 完全相同：進入 WSL2 shell 跑官方一行指令；差別在 gateway 常駐要用前景模式或 tmux，瀏覽器自動化建議走 MCP bridge。

**這頁適合誰**：想要完整 Linux 工具鏈的 Windows 使用者。只想快速上手的人可以先看 Windows 下載頁的 Desktop 路線。

## 步驟

1. ### 準備 WSL2

    以系統管理員開 PowerShell 安裝 WSL2（預設 Ubuntu），裝完重開機並完成 Linux 使用者設定。

    ```bash
    wsl --install
    ```

2. ### 在 WSL2 裡安裝前置套件

    進入 WSL2 shell 後安裝 curl 與 xz-utils。

    ```bash
    sudo apt update && sudo apt install curl xz-utils
    ```

3. ### 執行官方安裝指令

    與 Linux 相同的一行指令。

    ```bash
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
    ```

4. ### 重載 shell 並啟動

    ```bash
    source ~/.bashrc
    hermes
    ```

5. ### gateway 常駐（重要）

    官方 FAQ：systemd 在 WSL 不可靠，長駐請用前景模式或 tmux。

    ```bash
    hermes gateway run
    # 或
    tmux new -s hermes 'hermes gateway run'
    ```


## 完成後怎麼驗證

- hermes 能進入對話介面
- hermes doctor 全部通過
- gateway 用 tmux 常駐後重開 WSL 視窗仍存活

## 常見問題

### WSL2 裡怎麼控制 Windows 的 Chrome？

官方建議用 MCP bridge：把 chrome-devtools-mcp 設成 MCP server 讓 Hermes 透過 MCP 使用瀏覽器工具，比 /browser connect 可靠。

### 為什麼不直接在 PowerShell 跑？

官方有原生 PowerShell 安裝路徑，日常對話夠用；但完整終端機工具與腳本支援在 Linux 環境較完整，這也是社群教學普遍推 WSL2 的原因。

### nvm / pyenv 裝的工具 Hermes 找不到？

官方 FAQ：Hermes 預設 source ~/.bashrc，其他 shell 或自訂 PATH 要在 config.yaml 的 terminal.shell_init_files 加入初始化檔（如 ~/.zshrc、~/.nvm/nvm.sh）。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
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
