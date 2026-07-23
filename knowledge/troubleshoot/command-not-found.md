---
title: "hermes: command not found 怎麼解？"
description: "裝完 Hermes Agent 卻出現 hermes: command not found 的官方解法：重載 shell、檢查 PATH、其他 shell 的設定。"
date: 2026-07-23
subcategory: "install"
hermes_version: "*"
last_verified: 2026-07-04
upstream_refs:
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "install"
status: "published"
---

hermes: command not found 幾乎都是 shell 還沒重新載入 PATH：執行 source ~/.bashrc 或 source ~/.zshrc，或直接開新終端機；安裝器會把 ~/.local/bin 加進 PATH。

**這頁適合誰**：剛跑完安裝指令、第一次輸入 hermes 就報錯的人。

## 步驟

1. ### 重新載入 shell 設定

    bash 用戶載入 .bashrc，zsh 用戶（macOS 預設）載入 .zshrc。

    ```text
    source ~/.bashrc
    # 或
    source ~/.zshrc
    ```

2. ### 或直接開新終端機視窗

    新視窗會讀到安裝器更新後的 PATH。

3. ### 還是不行就檢查 PATH

    安裝器把執行檔加在 ~/.local/bin，確認它在 PATH 裡。

    ```text
    echo $PATH | tr ':' '\n' | grep local
    ```

4. ### 全面診斷

    ```bash
    hermes doctor
    ```


## 完成後怎麼驗證

- 新終端機輸入 hermes 能進入對話介面

## 常見問題

### 我用 fish / 其他 shell？

官方 FAQ：Hermes 預設 source ~/.bashrc，其他 shell 要在 config.yaml 的 terminal.shell_init_files 加入你的初始化檔。

### nvm、pyenv 裝的 node / python 也找不到？

同樣在 config.yaml 的 terminal.shell_init_files 加入 ~/.nvm/nvm.sh 等初始化檔。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
- [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
- [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
- [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
- [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
- [Hermes requires Python 3.11 or newer 怎麼解？](/troubleshoot/python-version-too-old/)
- [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
- [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
- [官方 Issue 精選問答](/issues/)
- [學校解法卡](/guides/)

資料來源：[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)

最後檢查：2026-07-04
