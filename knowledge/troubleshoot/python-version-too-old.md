---
title: "Hermes requires Python 3.11 or newer 怎麼解？"
description: "Hermes Agent 報 Python 版本太舊的解法：檢查版本、升級方式、以及為什麼官方安裝器通常不會遇到這個問題。"
date: 2026-07-23
subcategory: "install"
hermes_version: "*"
last_verified: 2026-07-23
upstream_refs:
  - "https://hermes-agent.nousresearch.com/install.sh"
  - "https://hermes-agent.nousresearch.com/docs/reference/faq"
tags:
  - "install"
status: "published"
---

Hermes 需要 Python 3.11 以上：先 python3 --version 確認版本，太舊就用系統套件管理器升級；走官方安裝器的話 Python 3.11 會自動處理，通常不會遇到。

**這頁適合誰**：自管 Python 環境、或在舊系統上安裝的人。

## 步驟

1. ### 檢查版本

    ```text
    python3 --version
    ```

2. ### 升級 Python

    用你的套件管理器升級到 3.11+（例如 Ubuntu 的 apt、macOS 的 brew）。

3. ### 缺 uv 套件管理器？

    官方 FAQ 給的安裝指令。

    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

4. ### 重跑官方安裝器

    官方安裝器本來就會自動處理 Python 3.11，重跑一次通常可以解掉環境問題。

    ```bash
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
    ```


## 完成後怎麼驗證

- python3 --version 顯示 3.11 以上
- hermes doctor 通過

## 常見問題

### 為什麼有人裝就不會遇到？

官方一行安裝器會自動安裝 Python 3.11，只有自管環境（如自己 pip 裝）才常撞到版本問題。

## 相關頁

- [Hermes Agent macOS 下載與安裝教學](/install/macos/)
- [Hermes Agent Windows 下載與安裝教學（Desktop / PowerShell / WSL2）](/install/windows/)
- [Hermes Agent Linux 下載與安裝教學](/install/linux/)
- [Hermes Agent WSL2 完整安裝教學（Windows 使用者進階路線）](/install/wsl2/)
- [Hermes Agent 模型供應商與 API key 設定教學](/config/model-provider/)
- [OpenClaw 搬家到 Hermes Agent 完整教學（官方 hermes claw migrate）](/migrate/migrate-from-openclaw/)
- [hermes: command not found 怎麼解？](/troubleshoot/command-not-found/)
- [API key not set / API key 無效怎麼解？](/troubleshoot/api-key-not-set/)
- [context length exceeded 怎麼解？](/troubleshoot/context-length-exceeded/)
- [Telegram 接 Hermes Agent 常見坑與解法](/troubleshoot/telegram/)
- [官方 Issue 精選問答](/issues/)
- [學校解法卡](/guides/)

資料來源：[官方 FAQ](https://hermes-agent.nousresearch.com/docs/reference/faq)

最後檢查：2026-07-04
